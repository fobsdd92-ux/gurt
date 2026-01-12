import { SlashCommandBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('giveawaystart')
    .setDescription('Start a giveaway')
    .addStringOption(o => o.setName('prize').setDescription('Prize').setRequired(true))
    .addIntegerOption(o => o.setName('duration').setDescription('Duration (seconds)').setRequired(true)),
  async execute(interaction) {
    const prize = interaction.options.getString('prize', true);
    const duration = interaction.options.getInteger('duration', true);
    const ch = process.env.GIVEAWAYS_CHANNEL_ID ? await interaction.client.channels.fetch(process.env.GIVEAWAYS_CHANNEL_ID).catch(()=>null) : interaction.channel;
    const msg = await ch.send({ content: `🎉 **GIVEAWAY** — ${prize}\nReact with 🎉 to enter! Ends in ${duration} seconds.` });
    await msg.react('🎉');
    const info = db.prepare('INSERT INTO giveaways (channel_id, message_id, prize, ends_at, winner_id, active) VALUES (?, ?, ?, ?, ?, ?)').run(ch.id, msg.id, prize, Math.floor(Date.now()/1000) + duration, '', 1);
    const id = info.lastInsertRowid;
    setTimeout(async ()=> {
      const row = db.prepare('SELECT * FROM giveaways WHERE id = ?').get(id);
      if (!row || row.active === 0) return;
      const m = await ch.messages.fetch(msg.id).catch(()=>null);
      const reaction = m?.reactions.cache.get('🎉');
      const users = reaction ? await reaction.users.fetch().catch(()=>null) : null;
      const arr = users ? Array.from(users.keys()).filter(i => i !== interaction.client.user.id) : [];
      if (!arr.length) { ch.send('No entries — ended with no winner.'); db.prepare('UPDATE giveaways SET active = 0 WHERE id = ?').run(id); return; }
      const winner = arr[Math.floor(Math.random()*arr.length)];
      db.prepare('UPDATE giveaways SET winner_id = ?, active = 0 WHERE id = ?').run(winner, id);
      ch.send(`🎉 Congratulations <@${winner}> — you won **${prize}**!`);
    }, duration*1000);
    await interaction.reply({ content: `Giveaway started (id ${id}) in ${ch}`, ephemeral: true });
  }
};
