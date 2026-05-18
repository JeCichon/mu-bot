require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const http = require('http');

// ─── Keep-Alive Server ────────────────────────────────────────────────────────
http.createServer((_, res) => res.end('Mu is here.')).listen(process.env.PORT || 3000);

// ─── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ─── Card Data ────────────────────────────────────────────────────────────────
const CARDS = [
  { id:0,  name:"The Fool",           timeframe:"Just for today",                         command:"Begin",       subject:"It is I that",                  verb:"embarks on quest",          adv:"without looking",        adj:"Curious",       noun:"Endeavor",        r:255,g:255,b:55,  suit:"major" },
  { id:1,  name:"The Magus",          timeframe:"For this moment",                        command:"Manifest",    subject:"My resolution",                 verb:"wills itself",              adv:"dynamically",            adj:"Inward",        noun:"Vigor",           r:255,g:255,b:0,   suit:"major" },
  { id:2,  name:"The Priestess",      timeframe:"For the next few breaths",               command:"Divine",      subject:"My mind",                       verb:"perceives",                 adv:"intuitively",            adj:"Hidden",        noun:"Intelligence",    r:42, g:42, b:255,  suit:"major" },
  { id:3,  name:"The Empress",        timeframe:"For this turning of the wheel",          command:"Nurture",     subject:"A mother's love",               verb:"bridges",                   adv:"safely",                 adj:"Pregnant",      noun:"Devotion",        r:0,  g:170,b:0,   suit:"major" },
  { id:4,  name:"The Emperor",        timeframe:"Within this cycle",                      command:"Command",     subject:"Justice and Order",             verb:"dominates",                 adv:"objectively",            adj:"Just",          noun:"Absolution",      r:255,g:0,  b:0,   suit:"major" },
  { id:5,  name:"The Hierophant",     timeframe:"An experiment for today",                command:"Teach",       subject:"Knowledge and Understanding",   verb:"discovers",                 adv:"faithfully",             adj:"Illuminated",   noun:"Truth",           r:255,g:102,b:0,   suit:"major" },
  { id:6,  name:"The Lovers",         timeframe:"Only for now",                           command:"Unite",       subject:"Opposites",                     verb:"consecrate",                adv:"whole heartedly",        adj:"Brave",         noun:"Decision",        r:255,g:138,b:13,  suit:"major" },
  { id:7,  name:"The Chariot",        timeframe:"As the worm turns",                      command:"Conquer",     subject:"The spirit of adventure",       verb:"overcomes",                 adv:"bravely",                adj:"Conquered",     noun:"Ego",             r:255,g:193,b:3,   suit:"major" },
  { id:8,  name:"The Adjustment",     timeframe:"Think for a moment",                     command:"Balance",     subject:"Harmony",                       verb:"seeks",                     adv:"responsibly",            adj:"Balanced",      noun:"Law",             r:0,  g:170,b:68,  suit:"major" },
  { id:9,  name:"The Hermit",         timeframe:"When you choose to",                     command:"Reflect",     subject:"That which is within",          verb:"embraces",                  adv:"seriously",              adj:"Deep",          noun:"Disillusionment", r:85, g:212,b:0,   suit:"major" },
  { id:10, name:"Fortune",            timeframe:"Today is awesome",                       command:"Prosper",     subject:"A calmness of spirit",          verb:"rises",                     adv:"in time",                adj:"Projected",     noun:"Wealth",          r:178,g:0,  b:109, suit:"major" },
  { id:11, name:"Lust",               timeframe:"*Kool-Aid Man bursts in* Oh yeah!",     command:"Passion",     subject:"Your animal nature",            verb:"transforms",                adv:"lovingly",               adj:"Passionate",    noun:"Energy",          r:182,g:234,b:0,   suit:"major" },
  { id:12, name:"The Hanged Man",     timeframe:"This may surprise you",                  command:"Surrender",   subject:"Acceptance",                    verb:"matures",                   adv:"wisely",                 adj:"Sacrificial",   noun:"Solution",        r:0,  g:102,b:255, suit:"major" },
  { id:13, name:"Death",              timeframe:"Ahh yes, a reset — try to",              command:"Transform",   subject:"Death",                         verb:"returns",                   adv:"consistently",           adj:"Cyclical",      noun:"Rebirth",         r:0,  g:136,b:131, suit:"major" },
  { id:14, name:"Art",                timeframe:"Your barriers are thinning",             command:"Synthesize",  subject:"The philosopher's stone",       verb:"dissolves and bonds",       adv:"completely",             adj:"Appropriate",   noun:"Measurement",     r:42, g:42, b:255,  suit:"major" },
  { id:15, name:"The Devil",          timeframe:"Stand in this moment",                   command:"Tempt",       subject:"Dark magic",                    verb:"opens awareness",           adv:"ritually",               adj:"Illuminating",  noun:"Darkness",        r:145,g:0,  b:178, suit:"major" },
  { id:16, name:"The Tower",          timeframe:"Through your pain, you hear",            command:"Reconstruct", subject:"Old systems",                   verb:"are leveled and replaced",  adv:"in the blink of an eye", adj:"Productive",    noun:"Destruction",     r:255,g:0,  b:0,   suit:"major" },
  { id:17, name:"The Star",           timeframe:"Your light speaks",                      command:"Innovate",    subject:"A creative moment",             verb:"innovates",                 adv:"faithfully",             adj:"Reckless",      noun:"Progress",        r:178,g:0,  b:109, suit:"major" },
  { id:18, name:"The Moon",           timeframe:"A feeling rushes over you",              command:"Illusion",    subject:"The depths of my soul",         verb:"confronts",                 adv:"profoundly",             adj:"Intuitive",     noun:"Knowledge",       r:206,g:0,  b:82,  suit:"major" },
  { id:19, name:"The Sun",            timeframe:"With great warmth",                      command:"Illuminate",  subject:"That which is beyond me",       verb:"fuels",                     adv:"boundlessly",            adj:"Confident",     noun:"Illumination",    r:255,g:138,b:13,  suit:"major" },
  { id:20, name:"The Aeon",           timeframe:"Upon waking",                            command:"Awaken",      subject:"A great correlation",           verb:"awakens",                   adv:"endlessly",              adj:"Liberating",    noun:"Power",           r:255,g:69, b:69,  suit:"major" },
  { id:21, name:"The Universe",       timeframe:"As this cycle ends",                     command:"Complete",    subject:"All that is",                   verb:"spins together",            adv:"freely",                 adj:"Karmic",        noun:"Conclusion",      r:145,g:0,  b:178, suit:"major" },
  { id:22, name:"Ace of Wands",       timeframe:"The journey begins today",               command:"Initiate",    subject:"Your talents",                  verb:"ignite",                    adv:"energetically",          adj:"Pioneering",    noun:"Spirit",          r:255,g:255,b:255, suit:"wands" },
  { id:23, name:"2 · Dominion",       timeframe:"A world of possibility awaits",          command:"Govern",      subject:"My Will",                       verb:"dominates",                 adv:"assertively",            adj:"Assertive",     noun:"Will",            r:0,  g:148,b:214, suit:"wands" },
  { id:24, name:"3 · Virtue",         timeframe:"Through your creation",                  command:"Establish",   subject:"Creative strength",             verb:"reinforces",                adv:"brilliantly",            adj:"Creative",      noun:"Harmony",         r:206,g:0,  b:82,  suit:"wands" },
  { id:25, name:"4 · Completion",     timeframe:"In this moment of order",                command:"Perfect",     subject:"A perfected work",              verb:"aligns with intention",     adv:"",                       adj:"Inner",         noun:"Order",           r:142,g:0,  b:100, suit:"wands" },
  { id:26, name:"5 · Strife",         timeframe:"While competing for progress",           command:"Challenge",   subject:"Competition",                   verb:"burns away",                adv:"individually",           adj:"Challenging",   noun:"Impulse",         r:255,g:138,b:13,  suit:"wands" },
  { id:27, name:"6 · Victory",        timeframe:"Tomorrow's in my eyes",                  command:"Succeed",     subject:"My fire",                       verb:"expands",                   adv:"joyfully",               adj:"Bright",        noun:"Personality",     r:255,g:168,b:168, suit:"wands" },
  { id:28, name:"7 · Valour",         timeframe:"Against the odds",                       command:"Endure",      subject:"Resistance",                    verb:"fights on",                 adv:"courageously",           adj:"Renewable",     noun:"Capacity",        r:255,g:193,b:3,   suit:"wands" },
  { id:29, name:"8 · Swiftness",      timeframe:"No time to waste",                       command:"Communicate", subject:"Your knowledge",                verb:"implements",                adv:"straightaway",           adj:"Unexpected",    noun:"Motivation",      r:178,g:0,  b:109, suit:"wands" },
  { id:30, name:"9 · Strength",       timeframe:"When you find your power within",        command:"Strengthen",  subject:"Emotion",                       verb:"becomes whole",             adv:"powerfully",             adj:"Spiritual",     noun:"Wholeness",       r:145,g:0,  b:178, suit:"wands" },
  { id:31, name:"10 · Oppression",    timeframe:"When the weight of expectation is heavy",command:"Subjugate",   subject:"My structure",                  verb:"grows",                     adv:"responsibly",            adj:"Self",          noun:"Determination",   r:255,g:255,b:0,   suit:"wands" },
  { id:32, name:"Prince of Wands",    timeframe:"With great focus",                       command:"Inspire",     subject:"Rich experience",               verb:"calls out",                 adv:"fiercely",               adj:"Attractive",    noun:"Arrogance",       r:243,g:111,b:12,  suit:"wands" },
  { id:33, name:"Princess of Wands",  timeframe:"In a flash of inspiration",              command:"Transform",   subject:"The love of life",              verb:"sublimates",                adv:"beautifully",            adj:"Enthusiastic",  noun:"Love",            r:170,g:106,b:0,   suit:"wands" },
  { id:34, name:"Queen of Wands",     timeframe:"For this transformation",                command:"Transform",   subject:"Compassion",                    verb:"changes",                   adv:"naturally",              adj:"Righteous",     noun:"Vision",          r:128,g:51, b:128, suit:"wands" },
  { id:35, name:"Knight of Wands",    timeframe:"In this spirit of chivalry",             command:"Inspire",     subject:"Ideal humanity",                verb:"affirms",                   adv:"inherently",             adj:"Personal",      noun:"Potential",       r:244,g:31, b:33,  suit:"wands" },
  { id:36, name:"Ace of Cups",        timeframe:"Love at first sip",                      command:"Embody",      subject:"The secret of love",            verb:"enlightens",                adv:"together",               adj:"Experiencing",  noun:"Grace",           r:250,g:250,b:250, suit:"cups"  },
  { id:37, name:"2 · Love",           timeframe:"In this moment",                         command:"Exchange",    subject:"The happiness of love",         verb:"balances",                  adv:"harmoniously",           adj:"Dissolving",    noun:"Boundaries",      r:174,g:177,b:178, suit:"cups"  },
  { id:38, name:"3 · Abundance",      timeframe:"For this turning of the wheel",          command:"Flow",        subject:"All that is needed",            verb:"flows",                     adv:"bountifully",            adj:"Overflowing",   noun:"Value",           r:0,  g:0,  b:0,   suit:"cups"  },
  { id:39, name:"4 · Luxury",         timeframe:"Within your safe harbor",                command:"Indulge",     subject:"Safety",                        verb:"stabilizes",                adv:"generously",             adj:"Emotional",     noun:"Prosperity",      r:42, g:42, b:255,  suit:"cups"  },
  { id:40, name:"5 · Disappointment", timeframe:"Within this time of reflection",         command:"Nurture",     subject:"A new consciousness",           verb:"tears through",             adv:"painfully",              adj:"Painful",       noun:"Birth",           r:255,g:39, b:0,   suit:"cups"  },
  { id:41, name:"6 · Pleasure",       timeframe:"Embrace this pleasure",                  command:"Indulge",     subject:"Your emotional power",          verb:"is found within",           adv:"blissfully",             adj:"Sensual",       noun:"Desire",          r:251,g:180,b:2,   suit:"cups"  },
  { id:42, name:"7 · Debauch",        timeframe:"Even when you choose not to",            command:"Dissipate",   subject:"A lack of balance",             verb:"dissolves",                 adv:"longingly",              adj:"Ephemeral",     noun:"Pleasure",        r:0,  g:170,b:0,   suit:"cups"  },
  { id:43, name:"8 · Indolence",      timeframe:"The resistance you feel is love",        command:"Forsake",     subject:"Self-denial",                   verb:"breaks down form",          adv:"resignedly",             adj:"Abandoned",     noun:"Values",          r:255,g:138,b:13,  suit:"cups"  },
  { id:44, name:"9 · Happiness",      timeframe:"A state of mind",                        command:"Fulfill",     subject:"Love",                          verb:"opens everything",          adv:"profoundly",             adj:"Optimistic",    noun:"Future",          r:178,g:0,  b:109, suit:"cups"  },
  { id:45, name:"10 · Satiety",       timeframe:"Acknowledge this bliss",                 command:"Satiate",     subject:"A new intensity",               verb:"gathers",                   adv:"warmly",                 adj:"Satisfied",     noun:"Being",           r:100,g:79, b:14,  suit:"cups"  },
  { id:46, name:"Prince of Cups",     timeframe:"In a peaceful state",                    command:"Embrace",     subject:"Sincerity",                     verb:"connects",                  adv:"logically",              adj:"Sincere",       noun:"Emotion",         r:117,g:112,b:139, suit:"cups"  },
  { id:47, name:"Princess of Cups",   timeframe:"As a dream unfolds",                     command:"Imagine",     subject:"Fantasy",                       verb:"dances",                    adv:"aesthetically",          adj:"Esoteric",      noun:"Intuition",       r:117,g:112,b:139, suit:"cups"  },
  { id:48, name:"Queen of Cups",      timeframe:"In this flow",                           command:"Comprehend",  subject:"The collective unconscious",    verb:"understands",               adv:"affectionately",         adj:"Feminine",      noun:"Wisdom",          r:1,  g:52, b:255,  suit:"cups"  },
  { id:49, name:"Knight of Cups",     timeframe:"Wait for his return",                    command:"Offer",       subject:"A compassionate spirit",        verb:"shares",                    adv:"hesitantly",             adj:"Renouncing",    noun:"Instincts",       r:117,g:32, b:161, suit:"cups"  },
  { id:50, name:"Ace of Swords",      timeframe:"To find your path",                      command:"Discern",     subject:"Your mind",                     verb:"cuts through the noise",    adv:"objectively",            adj:"Mindful",       noun:"Activities",      r:242,g:242,b:242, suit:"swords"},
  { id:51, name:"2 · Peace",          timeframe:"Find the quiet center",                  command:"Harmonize",   subject:"Stillness",                     verb:"holds",                     adv:"without incident",       adj:"Seeking",       noun:"Balance",         r:146,g:161,b:188, suit:"swords"},
  { id:52, name:"3 · Sorrow",         timeframe:"In the depths of night",                 command:"Mourn",       subject:"An ending",                     verb:"embodies purpose",          adv:"through suffering",      adj:"Growing",       noun:"Pains",           r:117,g:66, b:0,   suit:"swords"},
  { id:53, name:"4 · Truce",          timeframe:"While finding stillness",                command:"Perfect",     subject:"Stability",                     verb:"maintains",                 adv:"temporarily",            adj:"Arranging",     noun:"Peace",           r:84, g:11, b:85,  suit:"swords"},
  { id:54, name:"5 · Defeat",         timeframe:"When you admit your boundaries",         command:"Yield",       subject:"Your limit",                    verb:"reveals",                   adv:"intrinsically",          adj:"Passive",       noun:"Suffering",       r:255,g:111,b:99,  suit:"swords"},
  { id:55, name:"6 · Science",        timeframe:"For a deeper study",                     command:"Examine",     subject:"My objectivity",                verb:"measures",                  adv:"comprehensibly",         adj:"Objective",     noun:"Understanding",   r:255,g:95, b:93,  suit:"swords"},
  { id:56, name:"7 · Futility",       timeframe:"Stop looking back",                      command:"Surrender",   subject:"My lack of trust",              verb:"turns in on me",            adv:"dishonestly",            adj:"Stupid",        noun:"Trust",           r:231,g:221,b:23,  suit:"swords"},
  { id:57, name:"8 · Interference",   timeframe:"Through self-discipline, you find",      command:"Hinder",      subject:"Restraint and inhibition",      verb:"ensures development",       adv:"steadily",               adj:"Total",         noun:"Correlation",     r:133,g:27, b:28,  suit:"swords"},
  { id:58, name:"9 · Cruelty",        timeframe:"Break free from the grip",               command:"Torment",     subject:"Fear, guilt, and helplessness", verb:"torments",                  adv:"toxically",              adj:"Psychopathic",  noun:"Extremes",        r:51, g:0,  b:68,  suit:"swords"},
  { id:59, name:"10 · Ruin",          timeframe:"At the inevitable end",                  command:"Conclude",    subject:"A final blow",                  verb:"ends a cycle",              adv:"inevitably",             adj:"Disruptive",    noun:"Ending",          r:65, g:60, b:5,   suit:"swords"},
  { id:60, name:"Prince of Swords",   timeframe:"As you solve problems",                  command:"Invent",      subject:"A creative spirit",             verb:"seeks solutions",           adv:"with an open mind",      adj:"Breaking",      noun:"Chains",          r:243,g:238,b:12,  suit:"swords"},
  { id:61, name:"Princess of Swords", timeframe:"Then you will know the truth",           command:"Rebel",       subject:"Transparent insight",           verb:"rises",                     adv:"clairvoyantly",          adj:"Intellectual",  noun:"Revolution",      r:170,g:234,b:0,   suit:"swords"},
  { id:62, name:"Queen of Swords",    timeframe:"In your sharp mind",                     command:"Discern",     subject:"Unbiased intelligence",         verb:"decides",                   adv:"honestly",               adj:"Independent",   noun:"Resourcefulness", r:128,g:179,b:128, suit:"swords"},
  { id:63, name:"Knight of Swords",   timeframe:"With swift focus",                       command:"Focus",       subject:"Abstract thinking",             verb:"refines",                   adv:"like a storm",           adj:"Mental",        noun:"Strength",        r:244,g:158,b:33,  suit:"swords"},
  { id:64, name:"Ace of Disks",       timeframe:"Experience this moment",                 command:"Materialize", subject:"Great happiness",               verb:"shines",                    adv:"within and without",     adj:"Tangible",      noun:"Matter",          r:255,g:246,b:205, suit:"disks" },
  { id:65, name:"2 · Change",         timeframe:"For this moment",                        command:"Transform",   subject:"Division",                      verb:"changes",                   adv:"infinitely",             adj:"Mirrored",      noun:"Reality",         r:166,g:153,b:142, suit:"disks" },
  { id:66, name:"3 · Works",          timeframe:"For this labor of love",                 command:"Construct",   subject:"Self-development",              verb:"grows",                     adv:"constructively",         adj:"Crystallized",  noun:"Force",           r:202,g:184,b:184, suit:"disks" },
  { id:67, name:"4 · Power",          timeframe:"Within this cycle",                      command:"Consolidate", subject:"Your fortress",                 verb:"defines reality",           adv:"for now",                adj:"Reinforced",    noun:"Stability",       r:67, g:136,b:146, suit:"disks" },
  { id:68, name:"5 · Worry",          timeframe:"Within this trial",                      command:"Concern",     subject:"The current crisis",            verb:"opens your eyes",           adv:"urgently",               adj:"Unfortunate",   noun:"Thought",         r:132,g:56, b:56,  suit:"disks" },
  { id:69, name:"6 · Success",        timeframe:"Enjoy the fruit of your labor",          command:"Succeed",     subject:"Prosperity",                    verb:"overcomes",                 adv:"abundantly",             adj:"Heavenly",      noun:"Conditions",      r:163,g:121,b:15,  suit:"disks" },
  { id:70, name:"7 · Failure",        timeframe:"Through your disappointment, you see",   command:"Vanish",      subject:"Darkness",                      verb:"disintegrates",             adv:"effortlessly",           adj:"Prolonged",     noun:"Emptiness",       r:158,g:163,b:15,  suit:"disks" },
  { id:71, name:"8 · Prudence",       timeframe:"With steady intention",                  command:"Cultivate",   subject:"Self-discipline",               verb:"adapts",                    adv:"orderly",                adj:"Comprehensive", noun:"View",            r:174,g:145,b:98,  suit:"disks" },
  { id:72, name:"9 · Gain",           timeframe:"In your abundance",                      command:"Acquire",     subject:"Financial luck",                verb:"achieves",                  adv:"satisfactorily",         adj:"Material",      noun:"Adequacy",        r:67, g:146,b:130, suit:"disks" },
  { id:73, name:"10 · Wealth",        timeframe:"You reap what you sowed",                command:"Accumulate",  subject:"Earthly happiness",             verb:"culminates",                adv:"splendidly",             adj:"Prosperous",    noun:"Foundation",      r:57, g:57, b:13,  suit:"disks" },
  { id:74, name:"Prince of Disks",    timeframe:"Your hard work is noticed",              command:"Cultivate",   subject:"Work",                          verb:"shapes you",                adv:"reliably",               adj:"Industrious",   noun:"Temperament",     r:116,g:238,b:12,  suit:"disks" },
  { id:75, name:"Princess of Disks",  timeframe:"Rooted in the earth",                    command:"Nurture",     subject:"Motherly intuition",            verb:"nurtures",                  adv:"calmly",                 adj:"Physical",      noun:"Connection",      r:43, g:234,b:0,   suit:"disks" },
  { id:76, name:"Queen of Disks",     timeframe:"As the cycle continues",                 command:"Ground",      subject:"Family",                        verb:"strengthens",               adv:"sensibly",               adj:"Luxurious",     noun:"Matriarchy",      r:0,  g:179,b:128, suit:"disks" },
  { id:77, name:"Knight of Disks",    timeframe:"With steady resolve",                    command:"Commune",     subject:"Perseverance",                  verb:"communes with Mother Nature",adv:"patiently",              adj:"Masculine",     noun:"Influence",       r:116,g:158,b:33,  suit:"disks" },
];

// ─── Library Colors & Emojis ──────────────────────────────────────────────────
const ENTRY_COLORS = {
  item:      0x8B6914,
  character: 0x6B4FA0,
  session:   0x1A6B5A,
  concept:   0x1A3F6B,
  place:     0x2D6B1A,
};
const ENTRY_EMOJI = {
  item: '📖', character: '🧙', session: '🎭', concept: '🌀', place: '🗺️',
};

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

// ─── Mu's Koan Voice ──────────────────────────────────────────────────────────
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
function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rgbToHex(r,g,b) {
  const lum = (r*299 + g*587 + b*114) / 1000;
  if (lum < 20) { r=30; g=20; b=40; }
  return (r << 16) + (g << 8) + b;
}
function imageUrl(card) {
  return `https://raw.githubusercontent.com/JeCichon/mu-bot/main/images/${String(card.id).padStart(2,'0')}.png`;
}

const STOP_WORDS = new Set(['what','does','the','is','are','was','were','will','would','could','should','how','why','when','where','who','which','that','this','these','those','and','but','or','for','with','from','into','onto','over','under','about','after','before','between','have','has','had','can','its','your','my','our','their','you','they','them','just','very','then','than','more','some','been','being','also','each','there']);
function extractKeyWords(text) {
  return text.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w));
}

// ─── Sentence Builder ─────────────────────────────────────────────────────────
const SENTENCE_TEMPLATES = {
  2: [
    c => `${c[0].subject} ${c[1].verb}.`,
    c => `${c[0].adj} ${c[0].noun} — ${c[1].verb} ${c[1].adv}.`,
  ],
  3: [
    c => `${c[0].subject} ${c[1].verb} ${c[2].adv}.`,
    c => `${c[0].subject} ${c[1].verb} — ${c[2].adj} ${c[2].noun} ${c[1].adv}.`,
    c => `${c[0].adj} ${c[1].noun} ${c[2].verb} ${c[0].adv}. ${c[2].subject} listens.`,
  ],
  4: [
    c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[3].noun} ${c[0].verb} ${c[1].adv}.`,
    c => `Where ${c[0].subject} ${c[1].verb}, ${c[2].adj} ${c[3].noun} ${c[1].verb} ${c[2].adv}.`,
  ],
  5: [
    c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[4].noun} ${c[1].verb} ${c[3].adv}.`,
    c => `${c[0].subject} ${c[1].verb} ${c[2].adv} toward ${c[3].adj} ${c[4].noun}. ${c[2].subject} watches.`,
  ],
  6: [
    c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].subject} ${c[4].verb} ${c[5].adv}.`,
    c => `Where ${c[0].subject} ${c[1].verb} ${c[2].adv}, ${c[3].adj} ${c[4].noun} ${c[5].verb}.`,
  ],
  7: [
    c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[4].noun} ${c[5].verb} ${c[6].adv}.`,
  ],
  8: [
    c => `${c[0].subject} ${c[1].verb} ${c[2].adv}. ${c[3].adj} ${c[4].noun} ${c[5].verb} ${c[6].adv}. ${c[7].subject} ${c[0].verb}.`,
  ],
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
    .setTitle(card.name)
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
      { name:`${SUIT_EMOJI[focus.suit]} Focus`,      value:`**${focus.name}**\n*${focus.adj} ${focus.noun}*`, inline:true },
      { name:`${SUIT_EMOJI[ctxA.suit]}  Context I`,  value:`**${ctxA.name}**\n*${ctxA.adj} ${ctxA.noun}*`,   inline:true },
      { name:`${SUIT_EMOJI[ctxB.suit]}  Context II`, value:`**${ctxB.name}**\n*${ctxB.adj} ${ctxB.noun}*`,   inline:true },
    )
    .setThumbnail(imageUrl(focus))
    .setFooter({ text: "Three cards. One story. Yours to tell." });
}

function buildMuSpeaksEmbed(cards) {
  return new EmbedBuilder()
    .setColor(rgbToHex(cards[0].r, cards[0].g, cards[0].b))
    .setAuthor({ name: "Mu · The Great Librarian" })
    .setDescription(`*${buildSentence(cards)}*`)
    .setFooter({ text: cards.map(c => c.name).join('  ·  ') });
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
    .setFooter({ text: cards.map(c => c.name).join('  ·  ') });
}

function buildFortuneEmbed(cards, member) {
  const fortune  = buildFortune(cards);
  const cardLine = cards.map(c => c.name).join(' · ');
  return new EmbedBuilder()
    .setColor(rgbToHex(cards[0].r, cards[0].g, cards[0].b))
    .setAuthor({ name: `Mu · reaches out to ${member.displayName}` })
    .setDescription(`Dear <@${member.id}>,\n*${fortune}*`)
    .setFooter({ text: cardLine });
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

// ─── Library Embed Builders ───────────────────────────────────────────────────
function buildRememberEmbed(entry) {
  const fields = [
    { name: 'Type', value: entry.entry_type, inline: true },
    { name: 'Recorded by', value: entry.author, inline: true },
  ];
  if (entry.cards) fields.push({ name: 'Cards', value: entry.cards, inline: false });

  return new EmbedBuilder()
    .setColor(ENTRY_COLORS[entry.entry_type] || 0x4A3560)
    .setAuthor({ name: 'Mu · The Great Library' })
    .setTitle(`${ENTRY_EMOJI[entry.entry_type] || '📜'} ${entry.title}`)
    .setDescription(`*Mu places it carefully on the shelf.*\n\n${entry.content}`)
    .addFields(...fields)
    .setFooter({ text: 'Saved to the library.' });
}

function buildRecallEmbed(entry) {
  const fields = [
    { name: 'Type', value: entry.entry_type, inline: true },
    { name: 'Recorded by', value: entry.author || 'unknown', inline: true },
  ];
  if (entry.cards) fields.push({ name: 'Cards', value: entry.cards, inline: false });
  if (entry.tags)  fields.push({ name: 'Tags',  value: entry.tags,  inline: false });

  return new EmbedBuilder()
    .setColor(ENTRY_COLORS[entry.entry_type] || 0x4A3560)
    .setAuthor({ name: 'Mu · The Great Library' })
    .setTitle(`${ENTRY_EMOJI[entry.entry_type] || '📜'} ${entry.title}`)
    .setDescription(entry.content)
    .addFields(...fields)
    .setFooter({ text: new Date(entry.created_at).toLocaleDateString() });
}

function buildLibraryListEmbed(entries, type) {
  const heading = type ? `The Library · ${type}s` : 'The Library · Recent Entries';
  const lines   = entries.map(e =>
    `${ENTRY_EMOJI[e.entry_type] || '📜'} **${e.title}** — *${e.entry_type}*`
  );
  return new EmbedBuilder()
    .setColor(0x4A3560)
    .setAuthor({ name: 'Mu · The Great Library' })
    .setTitle(heading)
    .setDescription(lines.join('\n'))
    .setFooter({ text: 'Use /recall [title] to read an entry.' });
}

// ─── Bot Setup ────────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('clientReady', async () => {
  console.log(`✓ Mu is awake as ${client.user.tag}`);

  const rest = new REST({ version:'10' }).setToken(process.env.BOT_TOKEN);
  const commands = [
    new SlashCommandBuilder()
      .setName('draw')
      .setDescription('Draw a single card from the Thoth deck.')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('draw3')
      .setDescription('Draw three cards — one focus, two context.')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('askmu')
      .setDescription('Ask Mu a question and receive an answer from the cards.')
      .addStringOption(opt =>
        opt.setName('question').setDescription('What would you like to ask?').setRequired(true)
      ).toJSON(),
    new SlashCommandBuilder()
      .setName('fortune')
      .setDescription('Mu delivers a personal fortune to someone.')
      .addUserOption(opt =>
        opt.setName('recipient').setDescription('Who receives the fortune?').setRequired(true)
      ).toJSON(),
    new SlashCommandBuilder()
      .setName('remember')
      .setDescription('Save something to the Great Library.')
      .addStringOption(opt => opt.setName('title').setDescription('Name of this entry').setRequired(true))
      .addStringOption(opt => opt.setName('type').setDescription('Type of entry').setRequired(true)
        .addChoices(
          { name: 'Item',      value: 'item'      },
          { name: 'Character', value: 'character' },
          { name: 'Session',   value: 'session'   },
          { name: 'Concept',   value: 'concept'   },
          { name: 'Place',     value: 'place'     },
        ))
      .addStringOption(opt => opt.setName('subtype').setDescription('Subtype (e.g. book, weapon, god).').setRequired(false).setAutocomplete(true))
      .addStringOption(opt => opt.setName('content').setDescription('What do you want to record?').setRequired(true))
      .addStringOption(opt => opt.setName('cards').setDescription('Cards involved (optional)').setRequired(false))
      .addStringOption(opt => opt.setName('tags').setDescription('Tags for searching (optional)').setRequired(false))
      .toJSON(),
    new SlashCommandBuilder()
      .setName('recall')
      .setDescription('Retrieve an entry from the Great Library.')
      .addStringOption(opt => opt.setName('title').setDescription('What are you looking for?').setRequired(true))
      .toJSON(),
    new SlashCommandBuilder()
      .setName('library')
      .setDescription('Browse recent entries in the Great Library.')
      .addStringOption(opt => opt.setName('type').setDescription('Filter by type (optional)').setRequired(false)
        .addChoices(
          { name: 'Item',      value: 'item'      },
          { name: 'Character', value: 'character' },
          { name: 'Session',   value: 'session'   },
          { name: 'Concept',   value: 'concept'   },
          { name: 'Place',     value: 'place'     },
        ))
      .toJSON(),
  ];

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✓ Commands registered: /draw, /draw3, /askmu, /fortune, /remember, /recall, /library');
  } catch (err) {
    console.error('Command registration error:', err);
  }

  // Daily wisdom — 9am UTC
  cron.schedule('0 9 * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      await channel.send({ embeds: [buildDailyEmbed()] });
      console.log('✓ Daily wisdom posted');
    } catch (err) {
      console.error('Daily wisdom error:', err);
    }
  });

  // Daily fortune — 8am UTC
  cron.schedule('0 8 * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      await channel.guild.members.fetch();
      const members = channel.members.filter(m => !m.user.bot);
      if (members.size === 0) return;
      const member = members.random();
      const cards  = drawCards(3);
      await channel.send({ content: `<@${member.id}>`, embeds: [buildFortuneEmbed(cards, member)] });
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

// ─── Slash Commands ───────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  // Autocomplete handler
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === 'remember' && interaction.options.getFocused(true).name === 'subtype') {
      try {
        const typed = interaction.options.getFocused().toLowerCase();
        const { data } = await supabase
          .from('library_entries')
          .select('subtype')
          .not('subtype', 'is', null)
          .ilike('subtype', `%${typed}%`);
        const unique = [...new Set((data || []).map(r => r.subtype).filter(Boolean))].slice(0, 25);
        await interaction.respond(unique.map(s => ({ name: s, value: s })));
      } catch (err) {
        await interaction.respond([]);
      }
    }
    return;
  }
  if (!interaction.isChatInputCommand()) return;
  try {
    // Card commands
    if (interaction.commandName === 'draw') {
      const [card] = drawCards(1);
      await interaction.reply({ embeds: [buildSingleDrawEmbed(card)] });
    }
    if (interaction.commandName === 'draw3') {
      await interaction.reply({ embeds: [buildThreeCardEmbed(drawCards(3))] });
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

    // Library commands
    if (interaction.commandName === 'remember') {
      await interaction.deferReply();
      const entry = {
        title:      interaction.options.getString('title'),
        entry_type: interaction.options.getString('type'),
        subtype:    interaction.options.getString('subtype') || null,
        content:    interaction.options.getString('content'),
        cards:      interaction.options.getString('cards') || null,
        tags:       interaction.options.getString('tags')  || null,
        author:     interaction.user.username,
      };
      const { error } = await supabase.from('library_entries').insert(entry);
      if (error) {
        await interaction.editReply(`*Mu frowns at the archive.* Something went wrong: ${error.message}`);
      } else {
        await interaction.editReply({ embeds: [buildRememberEmbed(entry)] });
      }
    }

    if (interaction.commandName === 'recall') {
      await interaction.deferReply();
      const title = interaction.options.getString('title');
      const { data, error } = await supabase
        .from('library_entries')
        .select('*')
        .ilike('title', `%${title}%`)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error || !data || data.length === 0) {
        await interaction.editReply(`*Mu searches the stacks.* Nothing found for "${title}".`);
      } else {
        await interaction.editReply({ embeds: [buildRecallEmbed(data[0])] });
      }
    }

    if (interaction.commandName === 'library') {
      await interaction.deferReply();
      const type = interaction.options.getString('type');
      let query = supabase.from('library_entries').select('*').order('created_at', { ascending:false }).limit(8);
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
