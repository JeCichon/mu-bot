# Mu · The Great Librarian

A Discord bot for Tricknologic — Thoth Tarot improv RPG system.

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
"# mu-bot" 
