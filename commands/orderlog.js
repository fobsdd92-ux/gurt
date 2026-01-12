import { SlashCommandBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('orderlog')
    .setDescription('Log an order')
    .addUserOption(o => o.setName('user').setDescription('User who logged').setRequired(false))
    .addStringOption(o => o.setName('client').setDescription('Client').setRequired(false))
    .addStringOption(o => o.setName('type').setDescription('Order type').setRequired(true))
    .addStringOption(o => o.setName('amount').setDescription('Amount').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const clientName = interaction.options.getString('client') || '';
    const type = interaction.options.getString('type');
    const amount = interaction.options.getString('amount') || '';
    const channelId = interaction.channelId || null;
    db.prepare('INSERT INTO orders (opener_id, client, type, amount, channel_id, timestamp) VALUES (?, ?, ?, ?, ?, ?)').run(user.id, clientName, type, amount, channelId, Math.floor(Date.now()/1000));
    await interaction.reply({ content: `Order logged: ${type} — ${clientName} (${amount})`, ephemeral: true });
  }
};
