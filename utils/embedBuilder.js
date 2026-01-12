import { EmbedBuilder } from 'discord.js';
export function buildEmbedFromOptions(opts = {}) {
  const e = new EmbedBuilder();
  if (opts.title) e.setTitle(opts.title);
  if (opts.description) e.setDescription(opts.description);
  if (opts.color) {
    try { e.setColor(opts.color); } catch { e.setColor('#2f3136'); }
  }
  if (opts.footer) e.setFooter({ text: opts.footer });
  if (opts.image) e.setImage(opts.image);
  if (opts.thumbnail) e.setThumbnail(opts.thumbnail);
  if (opts.author) e.setAuthor({ name: opts.author, iconURL: opts.authoricon || null, url: opts.url || null });
  return e;
}
