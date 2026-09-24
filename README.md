# Mu · The Great Librarian

A Discord bot for Tricknologic — Thoth Tarot improv RPG system.

Mu's primary home is now the Trickno Lodge web app (`wiki/index.html` +
`wiki/mu-brain.html`), not Discord — the sections below describing the
Discord bot are kept for reference but are no longer how most people meet
Mu day to day.

## Mu's Memory (Lodge)
Mu can recall things people say in Lodge chat, not just his curated
`library_entries`. Every chat message gets embedded and filed into a
`memories` table (see `phase2-memory.sql`), tagged with who said it — so it
can surface for anyone (communal) or specifically when Mu is talking with
that person (personal). Each person can pause this for themselves with the
🧿 / 🧘 "Mu is present / Mu is meditating" toggle next to their name in the
Lodge member list.

## Commands
- `/draw` — draws three cards: one focus, two context

## Daily Wisdom
Mu posts a koan to the configured channel every day at 9am UTC.
Change the cron schedule in `index.js` — look for `'0 9 * * *'`.

---

## Deployment on Render (free tier)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Mu awakens"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mu-bot.git
git push -u origin main
```

### 2. Create a Background Worker on Render
- Go to render.com → New → Background Worker
- Connect your GitHub repo
- **Build Command:** `npm install`
- **Start Command:** `node index.js`

### 3. Set Environment Variables in Render
In your service settings → Environment, add:
- `BOT_TOKEN` → your token (from Discord Developer Portal after resetting)
- `CLIENT_ID` → 1501255935035969656
- `GUILD_ID` → 1475912381656731806
- `CHANNEL_ID` → 1501209211475071006

### 4. Deploy
Render will build and start the bot. Watch the logs — you should see:
```
✓ Mu is awake as Mu#1234
✓ Commands registered
```

---

## Adding More Features Later
- **More commands:** copy the `/draw` block in `interactionCreate` and add to the commands array
- **Koan system expansion:** add more frames to `KOAN_FRAMES` — each is a function `(cardA, cardB) => string`
- **Separate koan word lists:** create arrays of words and build frames that pull from them independently of card draws
- **Character storage:** add a JSON file or free Supabase database to save player characters
