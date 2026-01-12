import { SlashCommandBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('loa')
    .setDescription('Submit LOA request')
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction) {
    const reason = interaction.options.getString('reason', true);
    db.prepare('INSERT INTO loas (user_id, reason, status, admin_id, timestamp) VALUES (?, ?, ?, ?, ?)').run(interaction.user.id, reason, 'pending', '', Math.floor(Date.now()/1000));
    await interaction.reply({ content: 'LOA request submitted.', ephemeral: true });
  }
};
