-- Phase 2: personal/communal memory + "Mu is present / meditating" toggle
-- Run this in the Supabase SQL editor before the wiki/index.html changes
-- will work (both fail silently/non-fatally until these exist, but Mu
-- won't actually capture or recall anything).

-- 1) Per-user listening toggle. Defaults to true ("present") so this
--    matches how the Lodge already behaves today — nothing changes for
--    anyone until they choose to have Mu meditate.
alter table user_roles
  add column if not exists mu_listening boolean not null default true;

-- 2) Captured chat memory. One row per human chat message (Mu's own
--    replies are never captured). "Personal" and "communal" are NOT two
--    separate tables — every row carries the speaker's user_id, so:
--      communal = search every row (any user's question can surface it)
--      personal = search only rows where user_id = the person Mu is
--                 currently talking with
--    index.html currently only does the communal search; user_id is there
--    so a personal-scoped search is a small follow-up, not a schema change.
create table if not exists memories (
  id bigint generated always as identity primary key,
  message_id bigint references messages(id) on delete cascade,
  user_id uuid not null,
  user_name text,
  content text not null,
  embedding jsonb,   -- ⚠️ check this: I'm matching the type I *infer*
                      -- library_entries.embedding uses from how the client
                      -- code reads it (parseEmbedding handles both a plain
                      -- array and a JSON string). Open library_entries in
                      -- the Supabase table editor and confirm its embedding
                      -- column type before running this — change `jsonb`
                      -- below to match exactly, or the two tables' embeddings
                      -- won't come back from the client in the same shape.
  created_at timestamptz not null default now()
);

alter table memories enable row level security;

-- Anyone signed in can search all memories (this is what makes "communal"
-- possible) — mirrors how library_entries and messages are already public
-- to any logged-in Lodge member.
create policy "memories readable by authenticated"
  on memories for select
  to authenticated
  using (true);

-- You can only ever write memory rows tagged as yourself.
create policy "memories insertable by owner"
  on memories for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Supabase is retiring automatic Data API grants for new tables
-- (effective Oct 30, 2026) — explicit grants are required going forward.
grant select, insert on memories to authenticated;
