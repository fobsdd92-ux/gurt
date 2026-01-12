import db from '../db.js';
export function formatTicketName(statusEmoji, typeKey, openerName) {
  const t = String(typeKey).replace(/[^a-z0-9-]/gi, '').slice(0, 16).toLowerCase();
  const opener = String(openerName).replace(/[^a-z0-9]/gi, '').slice(0,12).toLowerCase();
  return `${statusEmoji}-${t}-${opener}`.slice(0,90);
}
export function saveTicket(channelId, openerId, type) {
  db.prepare('INSERT INTO tickets (channel_id, opener_id, type, status, timestamp) VALUES (?, ?, ?, ?, ?)').run(channelId, openerId, type, 'unclaimed', Math.floor(Date.now()/1000));
}
export function updateTicketStatus(channelId, status, claimedBy='') {
  db.prepare('UPDATE tickets SET status = ?, claimed_by = ? WHERE channel_id = ?').run(status, claimedBy, channelId);
}
