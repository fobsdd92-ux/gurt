import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('infraction')
    .setDescription('View an infraction by case id')
    .addIntegerOption(o => o.setName('case').setDescription('Case ID').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger('case', true);
    const row = db.prepare('SELECT * FROM infractions WHERE case_id = ?').get(id);
    if (!row) return interaction.reply({ content: `No case found for ID ${id}`, ephemeral: true });
    const embed = new EmbedBuilder()
      .setTitle(`Infraction #${row.case_id}`)
      .addFields(
        { name: 'User', value: `<@${row.user_id}>`, inline: true },
        { name: 'Moderator', value: `<@${row.moderator_id}>`, inline: true },
        { name: 'Reason', value: row.reason || 'N/A', inline: false },
        { name: 'Punishment', value: row.punishment || 'N/A', inline: true },
        { name: 'Notes', value: row.notes || 'N/A', inline: true },
        { name: 'Expiration', value: row.expiration || 'N/A', inline: true }
      ).setTimestamp(row.timestamp * 1000);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
