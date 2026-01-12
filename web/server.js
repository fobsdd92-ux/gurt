import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import path from 'path';
import DiscordOAuth2 from 'discord-oauth2';
import db from '../db.js';
const app = express();
const oauth = new DiscordOAuth2({ clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, redirectUri: process.env.OAUTH_REDIRECT_URI });
app.set('view engine','ejs');
app.set('views', path.join(process.cwd(), 'web','views'));
app.use(express.urlencoded({ extended:true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'keyboardcat', resave:false, saveUninitialized:false }));
app.use(express.static(path.join(process.cwd(),'web','public')));

// helper: check owner (guild owner)
async function isGuildOwner(req) {
  try {
    if (!req.session?.user) return false;
    const guilds = req.session.user.guilds || [];
    return guilds.some(g => g.id === process.env.GUILD_ID && g.owner);
  } catch { return false; }
}

// routes
app.get('/', (req, res) => {
  res.render('index',{ user: req.session.user || null });
});

app.get('/login', (req, res) => {
  const url = oauth.generateAuthUrl({ scope: ['identify','guilds'], response_type: 'code' });
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect('/');
  try {
    const token = await oauth.tokenRequest({ code, scope: ['identify','guilds'], grantType: 'authorization_code', redirectUri: process.env.OAUTH_REDIRECT_URI });
    const user = await oauth.getUser(token.access_token);
    const guilds = await oauth.getUserGuilds(token.access_token);
    req.session.token = token;
    req.session.user = { id: user.id, username: user.username+'#'+user.discriminator, avatar: user.avatar, guilds };
    res.redirect('/dashboard');
  } catch (err) {
    console.error('auth error', err);
    res.redirect('/');
  }
});

// dashboard (protected)
app.get('/dashboard', async (req, res) => {
  if (!req.session?.user) return res.redirect('/');
  const owner = await isGuildOwner(req);
  // load permissions config
  const row = db.prepare('SELECT json FROM config WHERE key = ?').get('permissions');
  const perms = row ? JSON.parse(row.json) : {};
  res.render('dashboard',{ user: req.session.user, owner, perms });
});

// add permission (owner-only)
app.post('/dashboard/permissions/add', async (req, res) => {
  if (!req.session?.user) return res.redirect('/login');
  const owner = await isGuildOwner(req);
  if (!owner) return res.status(403).send('owner only');
  const { command, role, user } = req.body;
  const row = db.prepare('SELECT json FROM config WHERE key = ?').get('permissions');
  const perms = row ? JSON.parse(row.json) : {};
  if (!perms[command]) perms[command] = { roles: [], users: [] };
  if (role && !perms[command].roles.includes(role)) perms[command].roles.push(role);
  if (user && !perms[command].users.includes(user)) perms[command].users.push(user);
  db.prepare('INSERT OR REPLACE INTO config (key, json) VALUES (?, ?)').run('permissions', JSON.stringify(perms));
  res.redirect('/dashboard');
});

// create embed via dashboard
app.post('/dashboard/embed/create', async (req, res) => {
  if (!req.session?.user) return res.redirect('/login');
  const owner = await isGuildOwner(req);
  if (!owner) return res.status(403).send('owner only');
  const { title, description, color, footer, image, thumbnail, author, authoricon, channel } = req.body;
  // save embed config to DB for later (keyed by timestamp)
  const key = 'embed_' + Date.now();
  const obj = { title, description, color, footer, image, thumbnail, author, authoricon, channel };
  db.prepare('INSERT OR REPLACE INTO config (key, json) VALUES (?, ?)').run(key, JSON.stringify(obj));
  res.redirect('/dashboard');
});

// create private embed button via dashboard
app.post('/dashboard/button/create', async (req, res) => {
  if (!req.session?.user) return res.redirect('/login');
  const owner = await isGuildOwner(req);
  if (!owner) return res.status(403).send('owner only');
  const { label, text } = req.body;
  const id = 'embedbtn_' + Date.now();
  db.prepare('INSERT INTO embed_buttons (id, label, private_text) VALUES (?, ?, ?)').run(id, label, text);
  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => { req.session.destroy(()=>res.redirect('/')); });

const port = process.env.WEB_PORT || 3000;
app.listen(port, ()=>console.log(`Dashboard running on http://localhost:${port}`));
