import { SlashCommandBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('loaadmin')
    .setDescription('Manage LOA (approve/deny)')
    .addIntegerOption(o => o.setName('id').setDescription('LOA id').setRequired(true))
    .addStringOption(o => o.setName('action').setDescription('approve or deny').setRequired(true)),
  requirePermission: true,
  async execute(interaction) {
    const id = interaction.options.getInteger('id', true);
    const action = interaction.options.getString('action', true).toLowerCase();
    const loa = db.prepare('SELECT * FROM loas WHERE id = ?').get(id);
    if (!loa) return interaction.reply({ content: 'LOA not found.', ephemeral: true });
    if (!['approve','deny'].includes(action)) return interaction.reply({ content: 'Action must be approve or deny.', ephemeral: true });
    const status = action === 'approve' ? 'approved' : 'denied';
    db.prepare('UPDATE loas SET status = ?, admin_id = ? WHERE id = ?').run(status, interaction.user.id, id);
    await interaction.reply({ content: `LOA ${status}.`, ephemeral: true });
  }
};
