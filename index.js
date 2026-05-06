require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const cron = require('node-cron');
const http = require('http');

// ─── Keep-Alive Server ────────────────────────────────────────────────────────
http.createServer((_, res) => res.end('Mu is here.')).listen(process.env.PORT || 3000);

// ─── Card Data ────────────────────────────────────────────────────────────────
const CARDS = [
  { id:0,  name:"The Fool",           adj:"Curious",       noun:"Endeavor",        r:255,g:255,b:55,  suit:"major", desc:"Pure potential before experience shapes it — the leap taken before looking down." },
  { id:1,  name:"The Magus",          adj:"Inward",        noun:"Vigor",           r:255,g:255,b:0,   suit:"major", desc:"Will made into act; the one who bends reality by understanding how it bends." },
  { id:2,  name:"The Priestess",      adj:"Hidden",        noun:"Intelligence",    r:42, g:42, b:255,  suit:"major", desc:"The knowing that arrives before the reason does; silence with a memory." },
  { id:3,  name:"The Empress",        adj:"Pregnant",      noun:"Devotion",        r:0,  g:170,b:0,   suit:"major", desc:"The condition under which everything grows; abundance that doesn't ask permission." },
  { id:4,  name:"The Emperor",        adj:"Just",          noun:"Absolution",      r:255,g:0,  b:0,   suit:"major", desc:"Order imposed on chaos by will alone; civilization as an act of stubbornness." },
  { id:5,  name:"The Hierophant",     adj:"Illuminated",   noun:"Truth",           r:255,g:102,b:0,   suit:"major", desc:"Not the religion — the secret living inside the religion." },
  { id:6,  name:"The Lovers",         adj:"Brave",         noun:"Decision",        r:255,g:138,b:13,  suit:"major", desc:"The moment of irreversible choice where two paths become one step." },
  { id:7,  name:"The Chariot",        adj:"Conquered",     noun:"Ego",             r:255,g:193,b:3,   suit:"major", desc:"Victory through surrender; the warrior who wins by becoming the vehicle." },
  { id:8,  name:"The Adjustment",     adj:"Balanced",      noun:"Law",             r:0,  g:170,b:68,  suit:"major", desc:"The universe correcting its own ledger; not punishment but precision." },
  { id:9,  name:"The Hermit",         adj:"Deep",          noun:"Disillusionment", r:85, g:212,b:0,   suit:"major", desc:"The light carried alone into the dark; wisdom found only by going inward." },
  { id:10, name:"Fortune",            adj:"Projected",     noun:"Wealth",          r:178,g:0,  b:109, suit:"major", desc:"The wheel that turns whether you're ready or not; every peak carries its descent." },
  { id:11, name:"Lust",               adj:"Passionate",    noun:"Energy",          r:182,g:234,b:0,   suit:"major", desc:"The sacred fire of desire — not appetite but the radiance of loving what you are." },
  { id:12, name:"The Hanged Man",     adj:"Sacrificial",   noun:"Solution",        r:0,  g:102,b:255, suit:"major", desc:"Suspension chosen freely; the wisdom that only comes from stopping." },
  { id:13, name:"Death",              adj:"Cyclical",      noun:"Rebirth",         r:0,  g:136,b:131, suit:"major", desc:"Not an ending but a clearing; the scythe that makes room." },
  { id:14, name:"Art",                adj:"Appropriate",   noun:"Measurement",     r:42, g:42, b:255,  suit:"major", desc:"Fire and water meeting in the vessel and becoming something neither was alone." },
  { id:15, name:"The Devil",          adj:"Illuminating",  noun:"Darkness",        r:145,g:0,  b:178, suit:"major", desc:"The creative darkness; not evil but the raw material of everything, including light." },
  { id:16, name:"The Tower",          adj:"Productive",    noun:"Destruction",     r:255,g:0,  b:0,   suit:"major", desc:"The structure that had to fall; liberation living inside the destruction." },
  { id:17, name:"The Star",           adj:"Reckless",      noun:"Progress",        r:178,g:0,  b:109, suit:"major", desc:"The navigator's fixed point; hope practiced daily, not waited for." },
  { id:18, name:"The Moon",           adj:"Intuitive",     noun:"Knowledge",       r:206,g:0,  b:82,  suit:"major", desc:"What the mind makes in the dark when reason sleeps." },
  { id:19, name:"The Sun",            adj:"Confident",     noun:"Illumination",    r:255,g:138,b:13,  suit:"major", desc:"Consciousness fully expressed; the light that doesn't ask permission to shine." },
  { id:20, name:"The Aeon",           adj:"Liberating",    noun:"Power",           r:255,g:69, b:69,  suit:"major", desc:"The old age ended and the new one began; still unfolding in every direction." },
  { id:21, name:"The Universe",       adj:"Karmic",        noun:"Conclusion",      r:145,g:0,  b:178, suit:"major", desc:"The completed work; the dance that contains all other dances." },
  { id:22, name:"Ace of Wands",       adj:"Pioneering",    noun:"Spirit",          r:255,g:255,b:255, suit:"wands", desc:"Pure fire before it becomes anything specific; raw will at its most alive." },
  { id:23, name:"2 · Dominion",       adj:"Assertive",     noun:"Will",            r:0,  g:148,b:214, suit:"wands", desc:"Will finding its shape; fire learning to direct itself." },
  { id:24, name:"3 · Virtue",         adj:"Creative",      noun:"Harmony",         r:206,g:0,  b:82,  suit:"wands", desc:"The harmony of creative forces aligned; making something true." },
  { id:25, name:"4 · Completion",     adj:"Inner",         noun:"Order",           r:142,g:0,  b:100, suit:"wands", desc:"A cycle of fire closed; the quiet satisfaction of a finished thing." },
  { id:26, name:"5 · Strife",         adj:"Challenging",   noun:"Impulse",         r:255,g:138,b:13,  suit:"wands", desc:"Fire meeting resistance and growing hotter for it." },
  { id:27, name:"6 · Victory",        adj:"Bright",        noun:"Personality",     r:255,g:168,b:168, suit:"wands", desc:"The moment the battle turns in your favor; recognition earned through endurance." },
  { id:28, name:"7 · Valour",         adj:"Renewable",     noun:"Capacity",        r:255,g:193,b:3,   suit:"wands", desc:"Holding ground when everything says to yield." },
  { id:29, name:"8 · Swiftness",      adj:"Unexpected",    noun:"Motivation",      r:178,g:0,  b:109, suit:"wands", desc:"Fire moving at its natural speed — faster than thought, cleaner than planning." },
  { id:30, name:"9 · Strength",       adj:"Spiritual",     noun:"Wholeness",       r:145,g:0,  b:178, suit:"wands", desc:"The fire that has burned through everything and still burns." },
  { id:31, name:"10 · Oppression",    adj:"Self",          noun:"Determination",   r:255,g:255,b:0,   suit:"wands", desc:"Will turned against itself; the flame that became its own cage." },
  { id:32, name:"Prince of Wands",    adj:"Attractive",    noun:"Arrogance",       r:243,g:111,b:12,  suit:"wands", desc:"Brilliant, reckless, magnetic; the fire at its most dangerous and most alive." },
  { id:33, name:"Princess of Wands",  adj:"Enthusiastic",  noun:"Love",            r:170,g:106,b:0,   suit:"wands", desc:"Enthusiasm as a spiritual practice; the flame that dances for the joy of it." },
  { id:34, name:"Queen of Wands",     adj:"Righteous",     noun:"Vision",          r:128,g:51, b:128, suit:"wands", desc:"Fire that knows itself; warm and fierce, purposeful and magnetic." },
  { id:35, name:"Knight of Wands",    adj:"Personal",      noun:"Potential",       r:244,g:31, b:33,  suit:"wands", desc:"The first charge before strategy arrives; somehow, it works." },
  { id:36, name:"Ace of Cups",        adj:"Experiencing",  noun:"Grace",           r:250,g:250,b:250, suit:"cups",  desc:"Pure feeling before it becomes a named emotion; the cup empty and open." },
  { id:37, name:"2 · Love",           adj:"Dissolving",    noun:"Boundaries",      r:174,g:177,b:178, suit:"cups",  desc:"The boundary between self and other beginning to dissolve." },
  { id:38, name:"3 · Abundance",      adj:"Overflowing",   noun:"Value",           r:0,  g:0,  b:0,   suit:"cups",  desc:"So full it has stopped reaching; stillness as the deepest kind of overflow." },
  { id:39, name:"4 · Luxury",         adj:"Emotional",     noun:"Prosperity",      r:42, g:42, b:255,  suit:"cups",  desc:"Feeling grown comfortable in itself; pleasure and its long shadow." },
  { id:40, name:"5 · Disappointment", adj:"Painful",       noun:"Birth",           r:255,g:39, b:0,   suit:"cups",  desc:"The ache of what was hoped for and did not arrive." },
  { id:41, name:"6 · Pleasure",       adj:"Sensual",       noun:"Desire",          r:251,g:180,b:2,   suit:"cups",  desc:"Sensation fully savored; the gift of a body that feels." },
  { id:42, name:"7 · Debauch",        adj:"Ephemeral",     noun:"Pleasure",        r:0,  g:170,b:0,   suit:"cups",  desc:"Pleasure that has lost its center; wanting without the capacity to arrive." },
  { id:43, name:"8 · Indolence",      adj:"Abandoned",     noun:"Values",          r:255,g:138,b:13,  suit:"cups",  desc:"The feeling that has given up moving; still water forgetting it was a river." },
  { id:44, name:"9 · Happiness",      adj:"Optimistic",    noun:"Future",          r:178,g:0,  b:109, suit:"cups",  desc:"Sun through water; simple, warm, complete." },
  { id:45, name:"10 · Satiety",       adj:"Satisfied",     noun:"Being",           r:100,g:79, b:14,  suit:"cups",  desc:"The cup so full it overflows and you've stopped noticing." },
  { id:46, name:"Prince of Cups",     adj:"Sincere",       noun:"Emotion",         r:117,g:112,b:139, suit:"cups",  desc:"Feeling so deep it becomes strange; the mystic of the suit." },
  { id:47, name:"Princess of Cups",   adj:"Esoteric",      noun:"Intuition",       r:117,g:112,b:139, suit:"cups",  desc:"Intuition as a way of life; she reads water." },
  { id:48, name:"Queen of Cups",      adj:"Feminine",      noun:"Wisdom",          r:1,  g:52, b:255,  suit:"cups",  desc:"She contains without drowning; the mother of feeling." },
  { id:49, name:"Knight of Cups",     adj:"Renouncing",    noun:"Instincts",       r:117,g:32, b:161, suit:"cups",  desc:"The romantic who has renounced romance but keeps riding toward it." },
  { id:50, name:"Ace of Swords",      adj:"Mindful",       noun:"Activities",      r:242,g:242,b:242, suit:"swords", desc:"Pure mind before it cuts anything; the blade undrawn, the thought unthought." },
  { id:51, name:"2 · Peace",          adj:"Seeking",       noun:"Balance",         r:146,g:161,b:188, suit:"swords", desc:"The mind that has agreed to disagree with itself; fragile and honest." },
  { id:52, name:"3 · Sorrow",         adj:"Growing",       noun:"Pains",           r:117,g:66, b:0,   suit:"swords", desc:"The pain that teaches; growing pains of a mind becoming larger." },
  { id:53, name:"4 · Truce",          adj:"Arranging",     noun:"Peace",           r:84, g:11, b:85,  suit:"swords", desc:"Rest taken in the middle of conflict; the pause that makes continuation possible." },
  { id:54, name:"5 · Defeat",         adj:"Passive",       noun:"Suffering",       r:255,g:111,b:99,  suit:"swords", desc:"The mind that lost and is slowly learning what that means." },
  { id:55, name:"6 · Science",        adj:"Objective",     noun:"Understanding",   r:255,g:95, b:93,  suit:"swords", desc:"The mind working beautifully; understanding as its own reward." },
  { id:56, name:"7 · Futility",       adj:"Stupid",        noun:"Trust",           r:231,g:221,b:23,  suit:"swords", desc:"The clever plan that defeats itself; intelligence outwitting its own purpose." },
  { id:57, name:"8 · Interference",   adj:"Total",         noun:"Correlation",     r:133,g:27, b:28,  suit:"swords", desc:"Too many signals arriving at once; the mind tangled in its own wiring." },
  { id:58, name:"9 · Cruelty",        adj:"Psychopathic",  noun:"Extremes",        r:51, g:0,  b:68,  suit:"swords", desc:"Thought turned against the self; the mind as its own wound." },
  { id:59, name:"10 · Ruin",          adj:"Disruptive",    noun:"Ending",          r:65, g:60, b:5,   suit:"swords", desc:"The end that was always coming; the mind that watched it arrive." },
  { id:60, name:"Prince of Swords",   adj:"Breaking",      noun:"Chains",          r:243,g:238,b:12,  suit:"swords", desc:"The idea that breaks everything open; necessary, dangerous, brilliant." },
  { id:61, name:"Princess of Swords", adj:"Intellectual",  noun:"Revolution",      r:170,g:234,b:0,   suit:"swords", desc:"The revolutionary thought; she doesn't argue, she rearranges." },
  { id:62, name:"Queen of Swords",    adj:"Independent",   noun:"Resourcefulness", r:128,g:179,b:128, suit:"swords", desc:"Clarity without mercy; she sees and tells you exactly what she sees." },
  { id:63, name:"Knight of Swords",   adj:"Mental",        noun:"Strength",        r:244,g:158,b:33,  suit:"swords", desc:"The mind at full speed with no brakes and no apology." },
  { id:64, name:"Ace of Disks",       adj:"Tangible",      noun:"Matter",          r:255,g:246,b:205, suit:"disks",  desc:"The seed of everything material; potential made solid and held." },
  { id:65, name:"2 · Change",         adj:"Mirrored",      noun:"Reality",         r:166,g:153,b:142, suit:"disks",  desc:"The material world in perpetual flux; nothing stays, everything continues." },
  { id:66, name:"3 · Works",          adj:"Crystallized",  noun:"Force",           r:202,g:184,b:184, suit:"disks",  desc:"Skill made visible; the hands that know before the mind does." },
  { id:67, name:"4 · Power",          adj:"Reinforced",    noun:"Stability",       r:67, g:136,b:146, suit:"disks",  desc:"The earth holding what it has gathered; stability through accumulation." },
  { id:68, name:"5 · Worry",          adj:"Unfortunate",   noun:"Thought",         r:132,g:56, b:56,  suit:"disks",  desc:"The body knowing something is wrong before the mind names it." },
  { id:69, name:"6 · Success",        adj:"Heavenly",      noun:"Conditions",      r:163,g:121,b:15,  suit:"disks",  desc:"The right conditions arrived at the right time; abundance as alignment." },
  { id:70, name:"7 · Failure",        adj:"Prolonged",     noun:"Emptiness",       r:158,g:163,b:15,  suit:"disks",  desc:"The harvest that didn't come; what the earth teaches through withholding." },
  { id:71, name:"8 · Prudence",       adj:"Comprehensive", noun:"View",            r:174,g:145,b:98,  suit:"disks",  desc:"The careful tending that no one notices until it's gone." },
  { id:72, name:"9 · Gain",           adj:"Material",      noun:"Adequacy",        r:67, g:146,b:130, suit:"disks",  desc:"Enough; the deep satisfaction of sufficiency." },
  { id:73, name:"10 · Wealth",        adj:"Prosperous",    noun:"Foundation",      r:57, g:57, b:13,  suit:"disks",  desc:"Generations of accumulation made solid; the full foundation." },
  { id:74, name:"Prince of Disks",    adj:"Industrious",   noun:"Temperament",     r:116,g:238,b:12,  suit:"disks",  desc:"The patient builder; he takes his time and the thing gets made." },
  { id:75, name:"Princess of Disks",  adj:"Physical",      noun:"Connection",      r:43, g:234,b:0,   suit:"disks",  desc:"The body as sacred ground; she tends what grows in the dark." },
  { id:76, name:"Queen of Disks",     adj:"Luxurious",     noun:"Matriarchy",      r:0,  g:179,b:128, suit:"disks",  desc:"Abundance through presence; the earth that gives without being asked." },
  { id:77, name:"Knight of Disks",    adj:"Masculine",     noun:"Influence",       r:116,g:158,b:33,  suit:"disks",  desc:"Not fast, not flashy, immovable; the steady force that outlasts everything." },
];

// ─── Mu's Voice ───────────────────────────────────────────────────────────────
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

const SUIT_EMOJI = { major:"☉", wands:"🔥", cups:"🌊", swords:"⚔️", disks:"🌍" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function drawCards(n) { return [...CARDS].sort(() => Math.random() - 0.5).slice(0, n); }
function rgbToHex(r,g,b) {
  const lum = (r*299 + g*587 + b*114) / 1000;
  if (lum < 20) { r=30; g=20; b=40; }
  return (r << 16) + (g << 8) + b;
}
function imageUrl(card) {
  return `https://raw.githubusercontent.com/JeCichon/mu-bot/main/images/${card.id}.png`;
}

// ─── Embed Builders ───────────────────────────────────────────────────────────
function buildSingleDrawEmbed(card) {
  return new EmbedBuilder()
    .setColor(rgbToHex(card.r, card.g, card.b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setTitle(card.name)
    .setDescription(`${SUIT_EMOJI[card.suit]}  *${card.adj} ${card.noun}*\n\n${card.desc}`)
    .setImage(imageUrl(card))
    .setFooter({ text: pick(CARD_QUESTIONS) });
}

function buildThreeCardEmbed(cards) {
  const [focus, ctxA, ctxB] = cards;
  return new EmbedBuilder()
    .setColor(rgbToHex(focus.r, focus.g, focus.b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setTitle("The cards are drawn.")
    .setDescription(
      `*${focus.adj} ${focus.noun}* — sit with this.\n` +
      `*${ctxA.adj} ${ctxA.noun}* and *${ctxB.adj} ${ctxB.noun}* give it shape.`
    )
    .addFields(
      { name:`${SUIT_EMOJI[focus.suit]} Focus`,      value:`**${focus.name}**\n*${focus.adj} ${focus.noun}*`, inline:true },
      { name:`${SUIT_EMOJI[ctxA.suit]}  Context I`,  value:`**${ctxA.name}**\n*${ctxA.adj} ${ctxA.noun}*`,   inline:true },
      { name:`${SUIT_EMOJI[ctxB.suit]}  Context II`, value:`**${ctxB.name}**\n*${ctxB.adj} ${ctxB.noun}*`,   inline:true },
    )
    .setThumbnail(imageUrl(focus))
    .setFooter({ text: "Three cards. One story. Yours to tell." });
}

function buildDailyEmbed() {
  const [a, b] = drawCards(2);
  const koan  = pick(KOAN_FRAMES)(a, b);
  const intro = pick(MU_INTROS);
  return new EmbedBuilder()
    .setColor(rgbToHex(a.r, a.g, a.b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setDescription(`${intro}\n\n> ${koan}`)
    .setFooter({ text: `${a.name}  ·  ${b.name}` });
}

// ─── Bot ──────────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', async () => {
  console.log(`✓ Mu is awake as ${client.user.tag}`);

  const rest = new REST({ version:'10' }).setToken(process.env.BOT_TOKEN);
  const commands = [
    new SlashCommandBuilder().setName('draw').setDescription('Draw a single card from the Thoth deck.').toJSON(),
    new SlashCommandBuilder().setName('draw3').setDescription('Draw three cards — one focus, two context.').toJSON(),
  ];

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✓ Commands registered: /draw and /draw3');
  } catch (err) {
    console.error('Command registration error:', err);
  }

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
    const [card] = drawCards(1);
    await interaction.reply({ embeds: [buildSingleDrawEmbed(card)] });
  }

  if (interaction.commandName === 'draw3') {
    const cards = drawCards(3);
    await interaction.reply({ embeds: [buildThreeCardEmbed(cards)] });
  }
});

client.login(process.env.BOT_TOKEN);
