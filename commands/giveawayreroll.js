import { SlashCommandBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('giveawayreroll')
    .setDescription('Reroll a giveaway by id')
    .addIntegerOption(o => o.setName('id').setDescription('Giveaway id').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger('id', true);
    const row = db.prepare('SELECT * FROM giveaways WHERE id = ?').get(id);
    if (!row) return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
    const ch = await interaction.client.channels.fetch(row.channel_id).catch(()=>null);
    if (!ch) return interaction.reply({ content: 'Channel not found.', ephemeral: true });
    const msg = await ch.messages.fetch(row.message_id).catch(()=>null);
    if (!msg) return interaction.reply({ content: 'Giveaway message not found.', ephemeral: true });
    const reaction = msg.reactions.cache.get('🎉');
    const users = reaction ? await reaction.users.fetch().catch(()=>null) : null;
    const arr = users ? Array.from(users.keys()).filter(i => i !== interaction.client.user.id) : [];
    if (!arr.length) return interaction.reply({ content: 'No entries to reroll.', ephemeral: true });
    const winner = arr[Math.floor(Math.random()*arr.length)];
    db.prepare('UPDATE giveaways SET winner_id = ? WHERE id = ?').run(winner, id);
    await ch.send(`🎉 Giveaway reroll winner: <@${winner}> — prize **${row.prize}**`);
    await interaction.reply({ content: 'Rerolled.', ephemeral: true });
  }
};
