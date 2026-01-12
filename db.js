import Database from 'better-sqlite3';
const db = new Database('./bot.sqlite');
db.exec(`
CREATE TABLE IF NOT EXISTS infractions (
  case_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT, moderator_id TEXT, reason TEXT, punishment TEXT, notes TEXT, expiration TEXT, timestamp INTEGER
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  opener_id TEXT, client TEXT, type TEXT, amount TEXT, channel_id TEXT, timestamp INTEGER
);
CREATE TABLE IF NOT EXISTS suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT, suggestion TEXT, timestamp INTEGER
);
CREATE TABLE IF NOT EXISTS loas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT, reason TEXT, status TEXT, admin_id TEXT, timestamp INTEGER
);
CREATE TABLE IF NOT EXISTS giveaways (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id TEXT, message_id TEXT, prize TEXT, ends_at INTEGER, winner_id TEXT, active INTEGER
);
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  json TEXT
);
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id TEXT, opener_id TEXT, type TEXT, status TEXT, claimed_by TEXT, timestamp INTEGER
);
CREATE TABLE IF NOT EXISTS embed_buttons (
  id TEXT PRIMARY KEY,
  label TEXT,
  private_text TEXT
);
`);
export default db;
