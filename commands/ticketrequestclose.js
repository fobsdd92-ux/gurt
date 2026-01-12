import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder().setName('ticketrequestclose').setDescription('Request to close ticket'),
  async execute(interaction) {
    const ch = interaction.channel;
    if (!ch) return interaction.reply({ content: 'Use inside a ticket channel.', ephemeral: true });
    await ch.send({ content: `Close requested by <@${interaction.user.id}>. Staff can close with /ticketclose.` });
    await interaction.reply({ content: 'Close request noted.', ephemeral: true });
  }
};
