// One-time backfill: embeds every existing human message in the Lodge
// `messages` table and files it into `memories`, so Mu's recall isn't
// limited to chat that happened after Phase 2 went live.
//
// Run this from your own terminal (not through any bridge/proxy) — it
// needs a normal path to Supabase, and it needs the SERVICE ROLE key
// (not the public anon key already in wiki/index.html) so it can write
// memory rows on behalf of many different historical users at once. The
// anon key can't do that: the `memories` insert policy only allows a row
// where auth.uid() = user_id, which only ever holds for whoever is
// actually logged in — never true for a script backfilling everyone else's
// old messages. The service key bypasses RLS entirely, which is exactly
// why it must never be used from the browser or committed to git.
//
// Setup:
//   1. In Supabase → Project Settings → API, copy the "service_role" key
//      (NOT anon/public). (index.js's existing .env may already have a
//      privileged SUPABASE_KEY from the Discord bot — check there first.)
//   2. In mu-bot/.env (create it from .env.example if you don't have one —
//      .env is already git-ignored), add:
//        SUPABASE_URL=https://tngvginwtsldulqgufoe.supabase.co
//        SUPABASE_SERVICE_KEY=your_service_role_key_here
//   3. npm install @xenova/transformers   (supabase-js + dotenv are already
//      dependencies)
//   4. node backfill-memories.js
//
// Safe to re-run: it skips any message that already has a memories row
// (checked by message_id), so an interrupted run just picks up where it
// left off.

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
const EMBED_MODEL  = 'Xenova/all-MiniLM-L6-v2'; // same model index.html uses
const MIN_LENGTH   = 12;   // same noise filter as the live capture path
const BATCH_SIZE   = 20;   // messages embedded/inserted per progress log

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env — see the setup notes at the top of this file.');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  console.log('Loading embedding model (first run downloads it, ~30s)...');
  const { pipeline } = await import('@xenova/transformers');
  const embed = await pipeline('feature-extraction', EMBED_MODEL);

  console.log('Fetching existing memories (for dedup)...');
  const { data: existing, error: exErr } = await db
    .from('memories')
    .select('message_id')
    .not('message_id', 'is', null);
  if (exErr) { console.error('Failed to read memories:', exErr.message); process.exit(1); }
  const already = new Set((existing || []).map(r => r.message_id));

  console.log('Fetching Lodge chat history...');
  const { data: messages, error: msgErr } = await db
    .from('messages')
    .select('id,user_id,user_name,content,is_mu')
    .eq('is_mu', false)
    .order('created_at', { ascending: true });
  if (msgErr) { console.error('Failed to read messages:', msgErr.message); process.exit(1); }

  // The Lodge app also posts automated things into this same table (e.g.
  // "What's New" changelog announcements), tagged with a non-person
  // user_id like "system" instead of a real account UUID. Those aren't
  // something a person said, and memories.user_id is a uuid column that
  // rejects them outright — filter them out up front rather than letting
  // one bad row fail an entire batch of otherwise-good messages.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const humanAuthored = (messages || []).filter(m => UUID_RE.test(m.user_id));
  const systemCount = messages.length - humanAuthored.length;

  const longEnough = humanAuthored.filter(m => (m.content || '').trim().length >= MIN_LENGTH);
  const candidates = longEnough.filter(m => !already.has(m.id));
  const alreadyCount = longEnough.length - candidates.length;

  console.log(`Total human messages:            ${messages.length}`);
  console.log(`  of those, system/non-user posts skipped: ${systemCount}`);
  console.log(`Meeting length filter (>=${MIN_LENGTH}):  ${longEnough.length}`);
  console.log(`Already in memories:             ${alreadyCount}`);
  console.log(`To backfill now:                 ${candidates.length}`);
  if (candidates.length === 0) { console.log('Nothing to do.'); return; }

  let done = 0, failed = 0;
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const rows = [];
    for (const m of batch) {
      try {
        const output = await embed(m.content, { pooling: 'mean', normalize: true });
        rows.push({
          message_id: m.id,
          user_id: m.user_id,
          user_name: m.user_name,
          content: m.content,
          embedding: Array.from(output.data),
        });
      } catch (err) {
        console.warn(`  embed failed for message ${m.id}:`, err.message);
        failed++;
      }
    }
    if (rows.length) {
      const { error: insErr } = await db.from('memories').insert(rows);
      if (insErr) {
        // A whole-batch insert is all-or-nothing — one bad row fails every
        // row alongside it. Fall back to inserting one at a time so a
        // single unexpected row only costs itself, not its batch-mates.
        console.warn(`  batch insert failed (${insErr.message}) — retrying rows individually...`);
        for (const row of rows) {
          const { error: rowErr } = await db.from('memories').insert([row]);
          if (rowErr) { console.warn(`    message ${row.message_id} failed:`, rowErr.message); failed++; }
          else { done++; }
        }
      } else {
        done += rows.length;
      }
    }
    console.log(`  ${Math.min(i + BATCH_SIZE, candidates.length)}/${candidates.length} processed (${done} saved, ${failed} failed)`);
  }

  console.log(`\nDone. ${done} memories backfilled, ${failed} failed.`);
}

main().catch(err => { console.error('Backfill crashed:', err); process.exit(1); });
