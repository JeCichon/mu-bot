require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const cron = require('node-cron');
const http = require('http');

// ─── Keep-Alive Server (required for Render free Web Service) ─────────────────
// UptimeRobot pings this every 5 min to prevent Render from sleeping the bot.
http.createServer((_, res) => res.end('Mu is here.')).listen(process.env.PORT || 3000);

// ─── Card Data ────────────────────────────────────────────────────────────────
const CARDS = [
  // Major Arcana
  { id: 0,  name: "The Fool",              adj: "Curious",         noun: "Endeavor",       r: 255, g: 255, b: 55,  suit: "major" },
  { id: 1,  name: "The Magus",             adj: "Inward",          noun: "Vigor",          r: 255, g: 255, b: 0,   suit: "major" },
  { id: 2,  name: "The Priestess",         adj: "Hidden",          noun: "Intelligence",   r: 42,  g: 42,  b: 255, suit: "major" },
  { id: 3,  name: "The Empress",           adj: "Pregnant",        noun: "Devotion",       r: 0,   g: 170, b: 0,   suit: "major" },
  { id: 4,  name: "The Emperor",           adj: "Just",            noun: "Absolution",     r: 255, g: 0,   b: 0,   suit: "major" },
  { id: 5,  name: "The Hierophant",        adj: "Illuminated",     noun: "Truth",          r: 255, g: 102, b: 0,   suit: "major" },
  { id: 6,  name: "The Lovers",            adj: "Brave",           noun: "Decision",       r: 255, g: 138, b: 13,  suit: "major" },
  { id: 7,  name: "The Chariot",           adj: "Conquered",       noun: "Ego",            r: 255, g: 193, b: 3,   suit: "major" },
  { id: 8,  name: "The Adjustment",        adj: "Balanced",        noun: "Law",            r: 0,   g: 170, b: 68,  suit: "major" },
  { id: 9,  name: "The Hermit",            adj: "Deep",            noun: "Disillusionment",r: 85,  g: 212, b: 0,   suit: "major" },
  { id: 10, name: "Fortune",               adj: "Projected",       noun: "Wealth",         r: 178, g: 0,   b: 109, suit: "major" },
  { id: 11, name: "Lust",                  adj: "Passionate",      noun: "Energy",         r: 182, g: 234, b: 0,   suit: "major" },
  { id: 12, name: "The Hanged Man",        adj: "Sacrificial",     noun: "Solution",       r: 0,   g: 102, b: 255, suit: "major" },
  { id: 13, name: "Death",                 adj: "Cyclical",        noun: "Rebirth",        r: 0,   g: 136, b: 131, suit: "major" },
  { id: 14, name: "Art",                   adj: "Appropriate",     noun: "Measurement",    r: 42,  g: 42,  b: 255, suit: "major" },
  { id: 15, name: "The Devil",             adj: "Illuminating",    noun: "Darkness",       r: 145, g: 0,   b: 178, suit: "major" },
  { id: 16, name: "The Tower",             adj: "Productive",      noun: "Destruction",    r: 255, g: 0,   b: 0,   suit: "major" },
  { id: 17, name: "The Star",              adj: "Reckless",        noun: "Progress",       r: 178, g: 0,   b: 109, suit: "major" },
  { id: 18, name: "The Moon",              adj: "Intuitive",       noun: "Knowledge",      r: 206, g: 0,   b: 82,  suit: "major" },
  { id: 19, name: "The Sun",               adj: "Confident",       noun: "Illumination",   r: 255, g: 138, b: 13,  suit: "major" },
  { id: 20, name: "The Aeon",              adj: "Liberating",      noun: "Power",          r: 255, g: 69,  b: 69,  suit: "major" },
  { id: 21, name: "The Universe",          adj: "Karmic",          noun: "Conclusion",     r: 145, g: 0,   b: 178, suit: "major" },
  // Wands
  { id: 22, name: "Ace of Wands",          adj: "Pioneering",      noun: "Spirit",         r: 255, g: 255, b: 255, suit: "wands" },
  { id: 23, name: "2 · Dominion",          adj: "Assertive",       noun: "Will",           r: 0,   g: 148, b: 214, suit: "wands" },
  { id: 24, name: "3 · Virtue",            adj: "Creative",        noun: "Harmony",        r: 206, g: 0,   b: 82,  suit: "wands" },
  { id: 25, name: "4 · Completion",        adj: "Inner",           noun: "Order",          r: 142, g: 0,   b: 100, suit: "wands" },
  { id: 26, name: "5 · Strife",            adj: "Challenging",     noun: "Impulse",        r: 255, g: 138, b: 13,  suit: "wands" },
  { id: 27, name: "6 · Victory",           adj: "Bright",          noun: "Personality",    r: 255, g: 168, b: 168, suit: "wands" },
  { id: 28, name: "7 · Valour",            adj: "Renewable",       noun: "Capacity",       r: 255, g: 193, b: 3,   suit: "wands" },
  { id: 29, name: "8 · Swiftness",         adj: "Unexpected",      noun: "Motivation",     r: 178, g: 0,   b: 109, suit: "wands" },
  { id: 30, name: "9 · Strength",          adj: "Spiritual",       noun: "Wholeness",      r: 145, g: 0,   b: 178, suit: "wands" },
  { id: 31, name: "10 · Oppression",       adj: "Self",            noun: "Determination",  r: 255, g: 255, b: 0,   suit: "wands" },
  { id: 32, name: "Prince of Wands",       adj: "Attractive",      noun: "Arrogance",      r: 243, g: 111, b: 12,  suit: "wands" },
  { id: 33, name: "Princess of Wands",     adj: "Enthusiastic",    noun: "Love",           r: 170, g: 106, b: 0,   suit: "wands" },
  { id: 34, name: "Queen of Wands",        adj: "Righteous",       noun: "Vision",         r: 128, g: 51,  b: 128, suit: "wands" },
  { id: 35, name: "Knight of Wands",       adj: "Personal",        noun: "Potential",      r: 244, g: 31,  b: 33,  suit: "wands" },
  // Cups
  { id: 36, name: "Ace of Cups",           adj: "Experiencing",    noun: "Grace",          r: 250, g: 250, b: 250, suit: "cups" },
  { id: 37, name: "2 · Love",              adj: "Dissolving",      noun: "Boundaries",     r: 174, g: 177, b: 178, suit: "cups" },
  { id: 38, name: "3 · Abundance",         adj: "Overflowing",     noun: "Value",          r: 0,   g: 0,   b: 0,   suit: "cups" },
  { id: 39, name: "4 · Luxury",            adj: "Emotional",       noun: "Prosperity",     r: 42,  g: 42,  b: 255, suit: "cups" },
  { id: 40, name: "5 · Disappointment",    adj: "Painful",         noun: "Birth",          r: 255, g: 39,  b: 0,   suit: "cups" },
  { id: 41, name: "6 · Pleasure",          adj: "Sensual",         noun: "Desire",         r: 251, g: 180, b: 2,   suit: "cups" },
  { id: 42, name: "7 · Debauch",           adj: "Ephemeral",       noun: "Pleasure",       r: 0,   g: 170, b: 0,   suit: "cups" },
  { id: 43, name: "8 · Indolence",         adj: "Abandoned",       noun: "Values",         r: 255, g: 138, b: 13,  suit: "cups" },
  { id: 44, name: "9 · Happiness",         adj: "Optimistic",      noun: "Future",         r: 178, g: 0,   b: 109, suit: "cups" },
  { id: 45, name: "10 · Satiety",          adj: "Satisfied",       noun: "Being",          r: 100, g: 79,  b: 14,  suit: "cups" },
  { id: 46, name: "Prince of Cups",        adj: "Sincere",         noun: "Emotion",        r: 117, g: 112, b: 139, suit: "cups" },
  { id: 47, name: "Princess of Cups",      adj: "Esoteric",        noun: "Intuition",      r: 117, g: 112, b: 139, suit: "cups" },
  { id: 48, name: "Queen of Cups",         adj: "Feminine",        noun: "Wisdom",         r: 1,   g: 52,  b: 255, suit: "cups" },
  { id: 49, name: "Knight of Cups",        adj: "Renouncing",      noun: "Instincts",      r: 117, g: 32,  b: 161, suit: "cups" },
  // Swords
  { id: 50, name: "Ace of Swords",         adj: "Mindful",         noun: "Activities",     r: 242, g: 242, b: 242, suit: "swords" },
  { id: 51, name: "2 · Peace",             adj: "Seeking",         noun: "Balance",        r: 146, g: 161, b: 188, suit: "swords" },
  { id: 52, name: "3 · Sorrow",            adj: "Growing",         noun: "Pains",          r: 117, g: 66,  b: 0,   suit: "swords" },
  { id: 53, name: "4 · Truce",             adj: "Arranging",       noun: "Peace",          r: 84,  g: 11,  b: 85,  suit: "swords" },
  { id: 54, name: "5 · Defeat",            adj: "Passive",         noun: "Suffering",      r: 255, g: 111, b: 99,  suit: "swords" },
  { id: 55, name: "6 · Science",           adj: "Objective",       noun: "Understanding",  r: 255, g: 95,  b: 93,  suit: "swords" },
  { id: 56, name: "7 · Futility",          adj: "Stupid",          noun: "Trust",          r: 231, g: 221, b: 23,  suit: "swords" },
  { id: 57, name: "8 · Interference",      adj: "Total",           noun: "Correlation",    r: 133, g: 27,  b: 28,  suit: "swords" },
  { id: 58, name: "9 · Cruelty",           adj: "Psychopathic",    noun: "Extremes",       r: 51,  g: 0,   b: 68,  suit: "swords" },
  { id: 59, name: "10 · Ruin",             adj: "Disruptive",      noun: "Ending",         r: 65,  g: 60,  b: 5,   suit: "swords" },
  { id: 60, name: "Prince of Swords",      adj: "Breaking",        noun: "Chains",         r: 243, g: 238, b: 12,  suit: "swords" },
  { id: 61, name: "Princess of Swords",    adj: "Intellectual",    noun: "Revolution",     r: 170, g: 234, b: 0,   suit: "swords" },
  { id: 62, name: "Queen of Swords",       adj: "Independent",     noun: "Resourcefulness",r: 128, g: 179, b: 128, suit: "swords" },
  { id: 63, name: "Knight of Swords",      adj: "Mental",          noun: "Strength",       r: 244, g: 158, b: 33,  suit: "swords" },
  // Disks
  { id: 64, name: "Ace of Disks",          adj: "Tangible",        noun: "Matter",         r: 255, g: 246, b: 205, suit: "disks" },
  { id: 65, name: "2 · Change",            adj: "Mirrored",        noun: "Reality",        r: 166, g: 153, b: 142, suit: "disks" },
  { id: 66, name: "3 · Works",             adj: "Crystallized",    noun: "Force",          r: 202, g: 184, b: 184, suit: "disks" },
  { id: 67, name: "4 · Power",             adj: "Reinforced",      noun: "Stability",      r: 67,  g: 136, b: 146, suit: "disks" },
  { id: 68, name: "5 · Worry",             adj: "Unfortunate",     noun: "Thought",        r: 132, g: 56,  b: 56,  suit: "disks" },
  { id: 69, name: "6 · Success",           adj: "Heavenly",        noun: "Conditions",     r: 163, g: 121, b: 15,  suit: "disks" },
  { id: 70, name: "7 · Failure",           adj: "Prolonged",       noun: "Emptiness",      r: 158, g: 163, b: 15,  suit: "disks" },
  { id: 71, name: "8 · Prudence",          adj: "Comprehensive",   noun: "View",           r: 174, g: 145, b: 98,  suit: "disks" },
  { id: 72, name: "9 · Gain",              adj: "Material",        noun: "Adequacy",       r: 67,  g: 146, b: 130, suit: "disks" },
  { id: 73, name: "10 · Wealth",           adj: "Prosperous",      noun: "Foundation",     r: 57,  g: 57,  b: 13,  suit: "disks" },
  { id: 74, name: "Prince of Disks",       adj: "Industrious",     noun: "Temperament",    r: 116, g: 238, b: 12,  suit: "disks" },
  { id: 75, name: "Princess of Disks",     adj: "Physical",        noun: "Connection",     r: 43,  g: 234, b: 0,   suit: "disks" },
  { id: 76, name: "Queen of Disks",        adj: "Luxurious",       noun: "Matriarchy",     r: 0,   g: 179, b: 128, suit: "disks" },
  { id: 77, name: "Knight of Disks",       adj: "Masculine",       noun: "Influence",      r: 116, g: 158, b: 33,  suit: "disks" },
];

// ─── Mu's Voice ───────────────────────────────────────────────────────────────
// Koan frames — each takes two cards (a, b) and returns a line of wisdom.
// The cards are secretly drawn; the player sees only the words.
const KOAN_FRAMES = [
  (a, b) => `${a.adj} ${a.noun} does not explain itself to ${b.adj} ${b.noun}.`,
  (a, b) => `You are looking for ${b.noun}. ${a.adj} is the door.`,
  (a, b) => `The one who carries ${a.noun} cannot yet hold ${b.adj} ${b.noun}.`,
  (a, b) => `Before ${a.adj} ${a.noun} — what were you?`,
  (a, b) => `${b.adj} ${b.noun} waits at the end of every ${a.adj} path.`,
  (a, b) => `Ask ${a.adj} ${a.noun} what it costs. Then ask ${b.noun} what it gives.`,
  (a, b) => `${a.noun} speaks. ${b.adj} ${b.noun} listens. Neither moves.`,
  (a, b) => `The fool mistakes ${a.adj} ${a.noun} for the destination. The sage knows it is the weather.`,
  (a, b) => `What would ${a.adj} ${a.noun} do if it knew about ${b.adj} ${b.noun}?`,
  (a, b) => `${b.adj} is not the opposite of ${a.adj}. It is ${a.adj} after a long sleep.`,
  (a, b) => `You said you wanted ${b.noun}. Was that before or after you met ${a.adj} ${a.noun}?`,
  (a, b) => `${a.adj} ${a.noun} crossed the river. On the other side: ${b.adj} ${b.noun}. It turned back.`,
  (a, b) => `To become ${b.adj} is to release ${a.noun}. Have you thanked it yet?`,
  (a, b) => `${a.noun} and ${b.noun} are the same word in a language no one speaks anymore.`,
  (a, b) => `The ${a.adj} path leads here. The ${b.adj} path leads here. Both are correct.`,
  (a, b) => `Something ${a.adj} is asking for ${b.noun}. Give it nothing. See what it offers instead.`,
  (a, b) => `If ${a.adj} ${a.noun} is the question — ${b.adj} ${b.noun} is what you asked before you forgot to ask.`,
  (a, b) => `${b.noun} cannot be reached by ${a.adj} means. Try stillness.`,
  (a, b) => `${a.adj} ${a.noun} once tried to become ${b.noun}. The attempt was the arrival.`,
  (a, b) => `You already have ${b.noun}. That's why ${a.adj} ${a.noun} is so loud right now.`,
];

// Brief Mu intros — appear before the koan, once per daily post
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

// Suit display helpers
const SUIT_EMOJI = { major: "☉", wands: "🔥", cups: "🌊", swords: "⚔️", disks: "🌍" };
const SUIT_NAME  = { major: "Major Arcana", wands: "Wands", cups: "Cups", swords: "Swords", disks: "Disks" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function drawCards(n) {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function rgbToHex(r, g, b) {
  // Ensure we have a visible color against dark Discord backgrounds
  const lum = (r * 299 + g * 587 + b * 114) / 1000;
  if (lum < 20) { r = 30; g = 20; b = 40; } // near-black → deep purple
  return (r << 16) + (g << 8) + b;
}

function cardField(card, label) {
  return {
    name: `${SUIT_EMOJI[card.suit]} ${label}`,
    value: `**${card.name}**\n*${card.adj} ${card.noun}*`,
    inline: true,
  };
}

// ─── Embed Builders ───────────────────────────────────────────────────────────
function buildDrawEmbed(cards) {
  const [focus, ctxA, ctxB] = cards;

  return new EmbedBuilder()
    .setColor(rgbToHex(focus.r, focus.g, focus.b))
    .setTitle("The cards are drawn.")
    .setDescription(
      `*${focus.adj} ${focus.noun}* — sit with this.\n` +
      `*${ctxA.adj} ${ctxA.noun}* and *${ctxB.adj} ${ctxB.noun}* give it shape.`
    )
    .addFields(
      cardField(focus, "Focus"),
      cardField(ctxA, "Context I"),
      cardField(ctxB, "Context II"),
    )
    .setFooter({ text: "Three cards. One story. Yours to tell." });
}

function buildDailyEmbed() {
  const [a, b] = drawCards(2);
  const frame  = pick(KOAN_FRAMES);
  const intro  = pick(MU_INTROS);
  const koan   = frame(a, b);

  return new EmbedBuilder()
    .setColor(rgbToHex(a.r, a.g, a.b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setDescription(`${intro}\n\n> ${koan}`)
    .setFooter({ text: `${a.name}  ·  ${b.name}` });
}

// ─── Bot Setup ────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`✓ Mu is awake as ${client.user.tag}`);

  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  const commands = [
    new SlashCommandBuilder()
      .setName('draw')
      .setDescription('Draw three cards from the Thoth deck.')
      .toJSON(),
  ];

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✓ Commands registered');
  } catch (err) {
    console.error('Command registration error:', err);
  }

  // Schedule daily wisdom — 9am UTC. Change the cron string to shift the time.
  // Format: 'minute hour day month weekday'
  cron.schedule('0 9 * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      await channel.send({ embeds: [buildDailyEmbed()] });
      console.log('✓ Daily wisdom posted');
    } catch (err) {
      console.error('Daily post error:', err);
    }
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'draw') {
    const cards = drawCards(3);
    await interaction.reply({ embeds: [buildDrawEmbed(cards)] });
  }
});

client.login(process.env.BOT_TOKEN);
