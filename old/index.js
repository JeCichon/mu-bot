require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const http = require('http');

// ─── Keep-Alive Server ────────────────────────────────────────────────────────
http.createServer((_, res) => res.end('Mu is here.')).listen(process.env.PORT || 3000);

// ─── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ─── Cards (loaded from Supabase on startup) ──────────────────────────────────
let CARDS = [];

async function loadCards() {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('card_id', { ascending: true });
  if (error) { console.error('Failed to load cards:', error.message); process.exit(1); }
  CARDS = data;
  console.log(`✓ ${CARDS.length} cards loaded from the library`);
}

// ─── RGB helpers ──────────────────────────────────────────────────────────────
// Average RGB across an array of card objects
function averageRGB(cards) {
  if (!cards || cards.length === 0) return { r: 80, g: 60, b: 100 };
  const r = Math.round(cards.reduce((s, c) => s + c.r, 0) / cards.length);
  const g = Math.round(cards.reduce((s, c) => s + c.g, 0) / cards.length);
  const b = Math.round(cards.reduce((s, c) => s + c.b, 0) / cards.length);
  return { r, g, b };
}

// ─── Card Display ─────────────────────────────────────────────────────────────
const SUIT_EMOJI  = { major:'☉', wands:'🔥', cups:'🌊', swords:'⚔️', disks:'🌍' };
const SUIT_LABEL  = { major:'Major Arcana', wands:'Wands', cups:'Cups', swords:'Swords', disks:'Disks' };

function cardDisplayName(card) {
  if (card.suit === 'major') return card.name;
  return `${card.suit_number} · ${SUIT_LABEL[card.suit]} · ${card.name}`;
}

function cardSearchLabel(card) {
  if (card.suit === 'major') return card.name.toLowerCase();
  return `${card.suit_number} ${SUIT_LABEL[card.suit].toLowerCase()} ${card.name.toLowerCase()}`;
}

// ─── Library ──────────────────────────────────────────────────────────────────
const ENTRY_COLORS = { item:0x8B6914, character:0x6B4FA0, session:0x1A6B5A, concept:0x1A3F6B, place:0x2D6B1A };
const ENTRY_EMOJI  = { item:'📖', character:'🧙', session:'🎭', concept:'🌀', place:'🗺️' };

// ─── Fortune Templates ────────────────────────────────────────────────────────
const clean = s => s.replace(/\s{2,}/g,' ').replace(/ \./g,'.').replace(/ ,/g,',').trim();

const FORTUNE_TEMPLATES = [
  c => `${c[0].timeframe}, ${c[1].command} your ${c[2].adj} ${c[0].noun}.`,
  c => `${c[0].timeframe} — ${c[1].command} the ${c[2].adj} ${c[0].noun} within you.`,
  c => `${c[1].timeframe}, ${c[0].command} your ${c[2].adj} ${c[1].noun}. ${c[2].timeframe} — ${c[0].noun} follows.`,
  c => `${c[0].timeframe}, ${c[2].command} ${c[1].adj} ${c[0].noun} ${c[1].adv}.`,
  c => `${c[0].timeframe}, if you ${c[1].command}, ${c[2].adj} ${c[0].noun} finds you.`,
  c => `${c[2].timeframe} — if you ${c[0].command} your ${c[1].adj} ${c[2].noun}, ${c[1].timeframe}.`,
  c => `${c[0].timeframe}, ${c[1].command} ${c[2].adj} ${c[0].noun}. ${c[2].timeframe} — ${c[1].noun} answers.`,
  c => `${c[0].timeframe}, you will find ${c[1].adj} ${c[2].noun}.`,
  c => `${c[1].timeframe} — ${c[0].adj} ${c[2].noun} seeks you. ${c[1].command} it ${c[0].adv}.`,
  c => `${c[0].timeframe}, ${c[1].adj} ${c[2].noun} ${c[0].verb} ${c[2].adv}.`,
  c => `${c[0].timeframe} — ${c[1].subject} ${c[2].verb} ${c[1].adv}. ${c[0].command} your ${c[2].adj} ${c[1].noun}.`,
  c => `${c[2].timeframe}, ${c[0].command} ${c[1].adj} ${c[2].noun}. ${c[1].timeframe} — ${c[0].subject} ${c[2].verb}.`,
  c => `${c[0].timeframe}: ${c[1].adj} ${c[2].noun} ${c[0].verb}. ${c[2].command} it ${c[1].adv}.`,
  c => `${c[2].timeframe} — ${c[0].command} your ${c[1].adj} ${c[2].noun}, for ${c[0].noun} awaits.`,
];
function buildFortune(cards) { return clean(pick(FORTUNE_TEMPLATES)(cards)); }

// ─── Koan Voice ───────────────────────────────────────────────────────────────
const KOAN_FRAMES = [
  (a,b) => `${a.adj} ${a.noun} does not explain itself to ${b.adj} ${b.noun}.`,
  (a,b) => `You are looking for ${b.noun}. ${a.adj} is the door.`,
  (a,b) => `The one who carries ${a.noun} cannot yet hold ${b.adj} ${b.noun}.`,
  (a,b) => `Before ${a.adj} ${a.noun} — what were you?`,
  (a,b) => `${b.adj} ${b.noun} waits at the end of every ${a.adj} path.`,
  (a,b) => `Ask ${a.adj} ${a.noun} what it costs. Then ask ${b.noun} what it gives.`,
  (a,b) => `${a.noun} speaks. ${b.adj} ${b.noun} listens. Neither moves.`,
  (a,b) => `The fool mistakes ${a.adj} ${a.noun} for the destination. The sage knows it is the weather.`,
  (a,b) => `What would ${a.adj} ${a.noun} do if it knew about ${b.adj} ${b.noun}?`,
  (a,b) => `${b.adj} is not the opposite of ${a.adj}. It is ${a.adj} after a long sleep.`,
  (a,b) => `You said you wanted ${b.noun}. Was that before or after you met ${a.adj} ${a.noun}?`,
  (a,b) => `${a.adj} ${a.noun} crossed the river. On the other side: ${b.adj} ${b.noun}. It turned back.`,
  (a,b) => `To become ${b.adj} is to release ${a.noun}. Have you thanked it yet?`,
  (a,b) => `${a.noun} and ${b.noun} are the same word in a language no one speaks anymore.`,
  (a,b) => `The ${a.adj} path leads here. The ${b.adj} path leads here. Both are correct.`,
  (a,b) => `Something ${a.adj} is asking for ${b.noun}. Give it nothing. See what it offers instead.`,
  (a,b) => `If ${a.adj} ${a.noun} is the question — ${b.adj} ${b.noun} is what you asked before you forgot.`,
  (a,b) => `${b.noun} cannot be reached by ${a.adj} means. Try stillness.`,
  (a,b) => `${a.adj} ${a.noun} once tried to become ${b.noun}. The attempt was the arrival.`,
  (a,b) => `You already have ${b.noun}. That's why ${a.adj} ${a.noun} is so loud right now.`,
];

const CARD_QUESTIONS = [
  "Do you see that here? Or does this image take you somewhere else?",
  "Is that present in these lines? What does your eye find first?",
  "Does this image carry that feeling — or has it become something entirely its own?",
  "What would you call this card if you named it yourself?",
  "Do you feel that in this image? What does it ask of you?",
  "Is that what lives here? Or has this card told you something different?",
  "Does the image agree with the tradition? Or is it arguing?",
  "What in this image speaks loudest to you?",
  "Have you seen a card that fits this feeling better?",
  "Where does your eye go first — and what does that tell you?",
];

const MU_INTROS = [
  "*Mu sets something on the table. He does not say what it is.*",
  "*The library is quiet. Mu places a card face-down and walks away.*",
  "*From somewhere deep in the archive, Mu draws two threads together.*",
  "*Mu looks at you the way water looks at a stone.*",
  "*Without ceremony, Mu arrives. Without announcement, he leaves.*",
  "*The great librarian opens a door you didn't know was there.*",
  "*Mu found something in the stacks today. He leaves it here.*",
  "*He draws. He does not interpret. He offers.*",
  "*The card chose itself. Mu only held the deck.*",
  "*Something shifts in the archive. Mu smiles at nothing in particular.*",
];

const SUIT_CHOICES = [
  { name:'Major Arcana', value:'major'  },
  { name:'Wands',        value:'wands'  },
  { name:'Cups',         value:'cups'   },
  { name:'Swords',       value:'swords' },
  { name:'Disks',        value:'disks'  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function drawCards(n, suit) {
  const pool = suit ? CARDS.filter(c => c.suit === suit) : CARDS;
  const safe = pool.length > 0 ? pool : CARDS;
  return [...safe].sort(() => Math.random() - 0.5).slice(0, Math.min(n, safe.length));
}

function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function rgbToHex(r, g, b) {
  const lum = (r*299 + g*587 + b*114) / 1000;
  if (lum < 20) { r=30; g=20; b=40; }
  return (r << 16) + (g << 8) + b;
}

function imageUrl(card) {
  return `https://raw.githubusercontent.com/JeCichon/mu-bot/main/images/${String(card.card_id).padStart(2,'0')}.png`;
}

const STOP_WORDS = new Set(['what','does','the','is','are','was','were','will','would','could','should','how','why','when','where','who','which','that','this','these','those','and','but','or','for','with','from','into','onto','over','under','about','after','before','between','have','has','had','can','its','your','my','our','their','you','they','them','just','very','then','than','more','some','been','being','also','each','there']);
function extractKeyWords(text) {
  return text.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w));
}

// ─── Sentence Builder ─────────────────────────────────────────────────────────
const SENTENCE_TEMPLATES = {
  2: [ c => `${c[0].subject} ${c[1].verb}.`, c => `${c[0].adj} ${c[0].noun} — ${c[1].verb} ${c[1].adv}.` ],
  3: [ c => `${c[0].subject} ${c[1].verb} ${c[2].adv}.`, c => `${c[0].subject} ${c[1].verb} — ${c[2].adj} ${c[2].noun} ${c[1].adv}.`, c => `${c[0].adj} ${c[1].noun} ${c[2].verb} ${c[0].adv}. ${c[2].subject} listens.` ],
  4: [ c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[3].noun} ${c[0].verb} ${c[1].adv}.`, c => `Where ${c[0].subject} ${c[1].verb}, ${c[2].adj} ${c[3].noun} ${c[1].verb} ${c[2].adv}.` ],
  5: [ c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[4].noun} ${c[1].verb} ${c[3].adv}.`, c => `${c[0].subject} ${c[1].verb} ${c[2].adv} toward ${c[3].adj} ${c[4].noun}. ${c[2].subject} watches.` ],
  6: [ c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].subject} ${c[4].verb} ${c[5].adv}.`, c => `Where ${c[0].subject} ${c[1].verb} ${c[2].adv}, ${c[3].adj} ${c[4].noun} ${c[5].verb}.` ],
  7: [ c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[4].noun} ${c[5].verb} ${c[6].adv}.` ],
  8: [ c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[4].noun} ${c[5].verb} ${c[6].adv}. ${c[7].subject} ${c[0].verb}.` ],
};
function buildSentence(cards) {
  const n = Math.min(cards.length, 8);
  const templates = SENTENCE_TEMPLATES[n] || SENTENCE_TEMPLATES[3];
  return clean(pick(templates)(cards));
}

// ─── Embed Builders ───────────────────────────────────────────────────────────
function buildSingleDrawEmbed(card) {
  return new EmbedBuilder()
    .setColor(rgbToHex(card.r, card.g, card.b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setTitle(cardDisplayName(card))
    .setDescription(clean(`${SUIT_EMOJI[card.suit]}  *${card.adj} ${card.noun}*\n\n${card.subject} ${card.verb} ${card.adv}.`))
    .setImage(imageUrl(card))
    .setFooter({ text: pick(CARD_QUESTIONS) });
}

function buildThreeCardEmbed(cards) {
  const [focus, ctxA, ctxB] = cards;
  return new EmbedBuilder()
    .setColor(rgbToHex(focus.r, focus.g, focus.b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setTitle("The cards are drawn.")
    .setDescription(`*${focus.adj} ${focus.noun}* — sit with this.\n*${ctxA.adj} ${ctxA.noun}* and *${ctxB.adj} ${ctxB.noun}* give it shape.`)
    .addFields(
      { name:`${SUIT_EMOJI[focus.suit]} Focus`,      value:`**${cardDisplayName(focus)}**\n*${focus.adj} ${focus.noun}*`, inline:true },
      { name:`${SUIT_EMOJI[ctxA.suit]}  Context I`,  value:`**${cardDisplayName(ctxA)}**\n*${ctxA.adj} ${ctxA.noun}*`,   inline:true },
      { name:`${SUIT_EMOJI[ctxB.suit]}  Context II`, value:`**${cardDisplayName(ctxB)}**\n*${ctxB.adj} ${ctxB.noun}*`,   inline:true },
    )
    .setThumbnail(imageUrl(focus))
    .setFooter({ text: "Three cards. One story. Yours to tell." });
}

function buildMuSpeaksEmbed(cards) {
  return new EmbedBuilder()
    .setColor(rgbToHex(cards[0].r, cards[0].g, cards[0].b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setDescription(`*${buildSentence(cards)}*`)
    .setFooter({ text: cards.map(c => cardDisplayName(c)).join('  ·  ') });
}

function buildAskMuEmbed(cards, question) {
  const keywords = extractKeyWords(question);
  const chosenWords = [...keywords].sort(() => Math.random() - 0.5).slice(0,2);
  let sentence = buildSentence(cards);
  if (chosenWords.length > 0) {
    const word = chosenWords[0];
    sentence = pick([
      `*${word}* — ${sentence}`,
      `${sentence} *${word}* remains.`,
      `${sentence} What of *${word}*?`,
      `Before *${word}* — ${sentence}`,
    ]);
  }
  return new EmbedBuilder()
    .setColor(rgbToHex(cards[0].r, cards[0].g, cards[0].b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .addFields({ name: 'You asked:', value: `*"${question}"*` })
    .setDescription(`\n${sentence}`)
    .setFooter({ text: cards.map(c => cardDisplayName(c)).join('  ·  ') });
}

function buildFortuneEmbed(cards, member) {
  const fortune  = buildFortune(cards);
  const cardLine = cards.map(c => cardDisplayName(c)).join(' · ');
  return new EmbedBuilder()
    .setColor(rgbToHex(cards[0].r, cards[0].g, cards[0].b))
    .setAuthor({ name: `Mu · reaches out to ${member.displayName}` })
    .setDescription(`Dear <@${member.id}>,\n*${fortune}*`)
    .setFooter({ text: cardLine });
}

function buildRememberEmbed(entry, assignedCards) {
  const rgb    = assignedCards.length > 0 ? averageRGB(assignedCards) : null;
  const color  = rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : (ENTRY_COLORS[entry.entry_type] || 0x4A3560);
  const fields = [
    { name: 'Type',        value: entry.entry_type, inline: true },
    { name: 'Recorded by', value: entry.author,     inline: true },
  ];
  if (entry.subtype) fields.push({ name: 'Subtype', value: entry.subtype, inline: true });
  if (assignedCards.length > 0) fields.push({
    name:  'Cards',
    value: assignedCards.map(c => `${SUIT_EMOJI[c.suit]} ${cardDisplayName(c)}`).join('\n'),
    inline: false,
  });
  if (rgb) fields.push({ name: 'RGB', value: `${rgb.r} · ${rgb.g} · ${rgb.b}`, inline: true });
  if (entry.tags) fields.push({ name: 'Tags', value: entry.tags, inline: false });
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: 'Mu · The Great Library' })
    .setTitle(`${ENTRY_EMOJI[entry.entry_type] || '📜'} ${entry.title}`)
    .setDescription(`*Mu places it carefully on the shelf.*\n\n${entry.content}`)
    .addFields(...fields)
    .setFooter({ text: 'Saved to the library.' });
}

function buildRecallEmbed(entry, assignedCards) {
  const rgb   = (entry.r != null) ? { r: entry.r, g: entry.g, b: entry.b } : null;
  const color = rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : (ENTRY_COLORS[entry.entry_type] || 0x4A3560);
  const fields = [
    { name: 'Type',        value: entry.entry_type,          inline: true },
    { name: 'Recorded by', value: entry.author || 'unknown', inline: true },
  ];
  if (entry.subtype) fields.push({ name: 'Subtype', value: entry.subtype, inline: true });
  if (assignedCards && assignedCards.length > 0) fields.push({
    name:  'Cards',
    value: assignedCards.map(c => `${SUIT_EMOJI[c.suit]} ${cardDisplayName(c)}`).join('\n'),
    inline: false,
  });
  if (rgb) fields.push({ name: 'RGB', value: `${rgb.r} · ${rgb.g} · ${rgb.b}`, inline: true });
  if (entry.tags) fields.push({ name: 'Tags', value: entry.tags, inline: false });
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: 'Mu · The Great Library' })
    .setTitle(`${ENTRY_EMOJI[entry.entry_type] || '📜'} ${entry.title}`)
    .setDescription(entry.content)
    .addFields(...fields)
    .setFooter({ text: new Date(entry.created_at).toLocaleDateString() });
}

function buildLibraryListEmbed(entries, type) {
  const heading = type ? `The Library · ${type}s` : 'The Library · Recent Entries';
  const lines   = entries.map(e =>
    `${ENTRY_EMOJI[e.entry_type] || '📜'} **${e.title}** — *${e.entry_type}${e.subtype ? ' · ' + e.subtype : ''}*`
  );
  return new EmbedBuilder()
    .setColor(0x4A3560)
    .setAuthor({ name: 'Mu · The Great Library' })
    .setTitle(heading)
    .setDescription(lines.join('\n'))
    .setFooter({ text: 'Use /recall [title] to read an entry.' });
}

// ─── Bot ──────────────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('clientReady', async () => {
  await loadCards();
  console.log(`✓ Mu is awake as ${client.user.tag}`);

  const rest = new REST({ version:'10' }).setToken(process.env.BOT_TOKEN);

  // Card slot helper — 4 optional card autocomplete fields
  const cardSlot = (n) => new SlashCommandBuilder()
    .addStringOption(opt =>
      opt.setName(`card_${n}`)
         .setDescription(`Card ${n}`)
         .setRequired(false)
         .setAutocomplete(true)
    );

  const commands = [
    new SlashCommandBuilder().setName('draw').setDescription('Draw a single card — optionally filtered by suit.')
      .addStringOption(opt => opt.setName('suit').setDescription('Draw only from this suit (optional)').setRequired(false).addChoices(...SUIT_CHOICES))
      .toJSON(),
    new SlashCommandBuilder().setName('draw3').setDescription('Draw three cards — optionally filtered by suit.')
      .addStringOption(opt => opt.setName('suit').setDescription('Draw only from this suit (optional)').setRequired(false).addChoices(...SUIT_CHOICES))
      .toJSON(),
    new SlashCommandBuilder().setName('card').setDescription('Choose a specific card from the deck.')
      .addStringOption(opt => opt.setName('name').setDescription('Type a name, suit, or number').setRequired(true).setAutocomplete(true))
      .toJSON(),
    new SlashCommandBuilder().setName('askmu').setDescription('Ask Mu a question and receive an answer from the cards.')
      .addStringOption(opt => opt.setName('question').setDescription('What would you like to ask?').setRequired(true))
      .toJSON(),
    new SlashCommandBuilder().setName('fortune').setDescription('Mu delivers a personal fortune to someone.')
      .addUserOption(opt => opt.setName('recipient').setDescription('Who receives the fortune?').setRequired(true))
      .toJSON(),
    new SlashCommandBuilder()
      .setName('remember')
      .setDescription('Save something to the Great Library.')
      .addStringOption(opt => opt.setName('title').setDescription('Name of this entry').setRequired(true))
      .addStringOption(opt => opt.setName('type').setDescription('Type of entry').setRequired(true)
        .addChoices(
          { name:'Item',      value:'item'      },
          { name:'Character', value:'character' },
          { name:'Session',   value:'session'   },
          { name:'Concept',   value:'concept'   },
          { name:'Place',     value:'place'     },
        ))
      .addStringOption(opt => opt.setName('content').setDescription('What do you want to record?').setRequired(true))
      .addStringOption(opt => opt.setName('subtype').setDescription('Subtype (e.g. book, weapon, god)').setRequired(false).setAutocomplete(true))
      .addStringOption(opt => opt.setName('card_1').setDescription('Card 1').setRequired(false).setAutocomplete(true))
      .addStringOption(opt => opt.setName('card_2').setDescription('Card 2').setRequired(false).setAutocomplete(true))
      .addStringOption(opt => opt.setName('card_3').setDescription('Card 3').setRequired(false).setAutocomplete(true))
      .addStringOption(opt => opt.setName('card_4').setDescription('Card 4').setRequired(false).setAutocomplete(true))
      .addStringOption(opt => opt.setName('tags').setDescription('Tags for searching (optional)').setRequired(false).setAutocomplete(true))
      .toJSON(),
    new SlashCommandBuilder().setName('recall').setDescription('Retrieve an entry from the Great Library.')
      .addStringOption(opt => opt.setName('title').setDescription('What are you looking for?').setRequired(true).setAutocomplete(true))
      .toJSON(),
    new SlashCommandBuilder().setName('library').setDescription('Browse recent entries in the Great Library.')
      .addStringOption(opt => opt.setName('type').setDescription('Filter by type (optional)').setRequired(false)
        .addChoices(
          { name:'Item',      value:'item'      },
          { name:'Character', value:'character' },
          { name:'Session',   value:'session'   },
          { name:'Concept',   value:'concept'   },
          { name:'Place',     value:'place'     },
        ))
      .toJSON(),
  ];

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✓ Commands registered: /draw, /draw3, /card, /askmu, /fortune, /remember, /recall, /library');
  } catch (err) {
    console.error('Command registration error:', err);
  }

  // Daily fortune — 8am UTC
  cron.schedule('0 8 * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      await channel.guild.members.fetch();
      const members = channel.members.filter(m => !m.user.bot);
      if (members.size === 0) return;
      const member = members.random();
      const cards  = drawCards(3);
      await channel.send({ content:`<@${member.id}>`, embeds:[buildFortuneEmbed(cards, member)] });
      console.log(`✓ Daily fortune sent to ${member.displayName}`);
    } catch (err) {
      console.error('Daily fortune error:', err);
    }
  });
});

// ─── Message Triggers ─────────────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();
  try {
    if (content.includes('hey mu')) {
      await message.reply({ embeds: [buildMuSpeaksEmbed(drawCards(randBetween(2,5)))] });
    } else if (content.includes('sup mu')) {
      await message.reply({ embeds: [buildMuSpeaksEmbed(drawCards(randBetween(4,8)))] });
    }
  } catch (err) {
    console.error('Message trigger error (non-fatal):', err.message);
  }
});

// ─── Interactions ─────────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {

  // ── Autocomplete ──
  if (interaction.isAutocomplete()) {
    const focused = interaction.options.getFocused(true);
    const typed   = focused.value.toLowerCase();
    try {
      // Card name autocomplete — used by /card and /remember card_1-4
      if (focused.name === 'name' || focused.name.startsWith('card_')) {
        const matches = CARDS.filter(c => cardSearchLabel(c).includes(typed));
        await interaction.respond(
          matches.slice(0,25).map(c => ({
            name:  `${SUIT_EMOJI[c.suit]} ${cardDisplayName(c)}`,
            value: String(c.card_id),
          }))
        );

      } else if (interaction.commandName === 'remember' && focused.name === 'subtype') {
        const { data } = await supabase.from('library_entries').select('subtype').not('subtype','is',null).ilike('subtype',`%${typed}%`);
        const unique = [...new Set((data||[]).map(r=>r.subtype).filter(Boolean))].slice(0,25);
        await interaction.respond(unique.map(s=>({name:s,value:s})));

      } else if (interaction.commandName === 'remember' && focused.name === 'tags') {
        const { data } = await supabase.from('library_entries').select('tags').not('tags','is',null);
        const allTags = (data||[]).flatMap(r=>r.tags.split(',').map(t=>t.trim().toLowerCase())).filter(t=>t&&t.includes(typed));
        const unique = [...new Set(allTags)].slice(0,25);
        await interaction.respond(unique.map(s=>({name:s,value:s})));

      } else if (interaction.commandName === 'recall' && focused.name === 'title') {
        const { data } = await supabase.from('library_entries').select('title').ilike('title',`%${typed}%`).limit(25);
        const titles = (data||[]).map(r=>r.title).filter(Boolean);
        await interaction.respond(titles.map(s=>({name:s,value:s})));

      } else {
        await interaction.respond([]);
      }
    } catch (err) {
      await interaction.respond([]);
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;
  try {

    // ── Card draws ──
    if (interaction.commandName === 'draw') {
      const suit = interaction.options.getString('suit');
      const [card] = drawCards(1, suit);
      await interaction.reply({ embeds: [buildSingleDrawEmbed(card)] });
    }

    if (interaction.commandName === 'draw3') {
      const suit  = interaction.options.getString('suit');
      const cards = drawCards(3, suit);
      await interaction.reply({ embeds: [buildThreeCardEmbed(cards)] });
    }

    if (interaction.commandName === 'card') {
      const cardId = parseInt(interaction.options.getString('name'));
      const card   = CARDS.find(c => c.card_id === cardId);
      if (!card) {
        await interaction.reply({ content:`*Mu searches the archive.* No card found.`, ephemeral:true });
      } else {
        await interaction.reply({ embeds: [buildSingleDrawEmbed(card)] });
      }
    }

    if (interaction.commandName === 'askmu') {
      const question = interaction.options.getString('question');
      await interaction.reply({ embeds: [buildAskMuEmbed(drawCards(randBetween(3,5)), question)] });
    }

    if (interaction.commandName === 'fortune') {
      const user   = interaction.options.getUser('recipient');
      const member = await interaction.guild.members.fetch(user.id);
      await interaction.reply({ content:`<@${user.id}>`, embeds:[buildFortuneEmbed(drawCards(3), member)] });
    }

    // ── Library ──
    if (interaction.commandName === 'remember') {
      await interaction.deferReply();

      // Collect card slots
      const cardIds = ['card_1','card_2','card_3','card_4']
        .map(slot => interaction.options.getString(slot))
        .filter(Boolean)
        .map(v => parseInt(v))
        .filter(v => !isNaN(v));

      const assignedCards = cardIds.map(id => CARDS.find(c => c.card_id === id)).filter(Boolean);
      const rgb           = averageRGB(assignedCards);

      const entry = {
        title:      interaction.options.getString('title'),
        entry_type: interaction.options.getString('type'),
        content:    interaction.options.getString('content'),
        subtype:    interaction.options.getString('subtype') || null,
        tags:       interaction.options.getString('tags')    || null,
        author:     interaction.user.username,
        r:          assignedCards.length > 0 ? rgb.r : null,
        g:          assignedCards.length > 0 ? rgb.g : null,
        b:          assignedCards.length > 0 ? rgb.b : null,
      };

      const { data: inserted, error } = await supabase
        .from('library_entries')
        .insert(entry)
        .select()
        .single();

      if (error || !inserted) {
        await interaction.editReply(`*Mu frowns at the archive.* Something went wrong: ${error?.message}`);
        return;
      }

      // Save card assignments
      if (assignedCards.length > 0) {
        const assignments = assignedCards.map(c => ({ entry_id: inserted.id, card_id: c.card_id }));
        await supabase.from('library_card_assignments').insert(assignments);
      }

      await interaction.editReply({ embeds: [buildRememberEmbed(inserted, assignedCards)] });
    }

    if (interaction.commandName === 'recall') {
      await interaction.deferReply();
      const title = interaction.options.getString('title');
      const { data, error } = await supabase
        .from('library_entries')
        .select('*')
        .ilike('title',`%${title}%`)
        .order('created_at',{ascending:false})
        .limit(1);

      if (error || !data || data.length === 0) {
        await interaction.editReply(`*Mu searches the stacks.* Nothing found for "${title}".`);
        return;
      }

      const entry = data[0];

      // Fetch assigned cards
      const { data: assignments } = await supabase
        .from('library_card_assignments')
        .select('card_id')
        .eq('entry_id', entry.id);

      const assignedCards = (assignments || [])
        .map(a => CARDS.find(c => c.card_id === a.card_id))
        .filter(Boolean);

      await interaction.editReply({ embeds: [buildRecallEmbed(entry, assignedCards)] });
    }

    if (interaction.commandName === 'library') {
      await interaction.deferReply();
      const type = interaction.options.getString('type');
      let query = supabase.from('library_entries').select('*').order('created_at',{ascending:false}).limit(8);
      if (type) query = query.eq('entry_type', type);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        await interaction.editReply(`*The library is quiet.* ${type ? `No ${type} entries yet.` : 'Nothing recorded yet.'}`);
      } else {
        await interaction.editReply({ embeds: [buildLibraryListEmbed(data, type)] });
      }
    }

  } catch (err) {
    console.error('Interaction error (non-fatal):', err.message);
  }
});

client.login(process.env.BOT_TOKEN);
