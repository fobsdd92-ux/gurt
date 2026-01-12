import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('infractions')
    .setDescription('List infractions of a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const rows = db.prepare('SELECT * FROM infractions WHERE user_id = ? ORDER BY timestamp DESC').all(user.id);
    if (!rows.length) return interaction.reply({ content: 'No infractions for that user.', ephemeral: true });
    const description = rows.slice(0, 25).map(r => `Case ${r.case_id} — ${r.reason} (${new Date(r.timestamp*1000).toLocaleString()})`).join('\n');
    const embed = new EmbedBuilder().setTitle(`Infractions for ${user.tag}`).setDescription(description);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
