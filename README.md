# Discord Management Bot + Dashboard
This project includes a structured Discord bot (discord.js v14) with a web dashboard (Express + EJS).
It supports infractions, tickets, orders, suggestions, giveaways, LOA, promotions, feedback, config, and an embed/button system.

## Setup
1. Copy `.env.example` to `.env` and fill values (BOT TOKEN, CLIENT_ID, CLIENT_SECRET, GUILD_ID, etc.).
2. `npm install`
3. Run the bot: `npm start`
4. Run the web dashboard: `npm run start:web`
   - Dashboard will run on `http://localhost:3000` by default
5. Use the Discord OAuth login to authenticate. Only the guild owner can change settings in the dashboard UI.

## Notes
- SQLite database file `bot.sqlite` will be created in the working directory.
- The dashboard saves permission configs into the `config` table.
- Embed buttons created in the dashboard are stored in `embed_buttons` table and produce ephemeral replies when clicked.
