import db from '../db.js';
export function hasPermission(member, commandName) {
  if (!member) return false;
  if (member.permissions?.has?.('Administrator')) return true;
  const row = db.prepare('SELECT json FROM config WHERE key = ?').get('permissions');
  if (!row) return false;
  const perms = JSON.parse(row.json);
  const cmd = perms[commandName];
  if (!cmd) return false;
  if (cmd.roles && cmd.roles.length) {
    if (member.roles.cache.some(r => cmd.roles.includes(r.id))) return true;
  }
  if (cmd.users && cmd.users.includes(member.id)) return true;
  return false;
}
