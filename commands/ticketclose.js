import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder().setName('ticketclose').setDescription('Close ticket (staff)'),
  requirePermission: true,
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID) && !interaction.member.permissions.has('ManageGuild')) {
      return interaction.reply({ content: 'Only staff can close tickets.', ephemeral: true });
    }
    const ch = interaction.channel;
    if (!ch) return interaction.reply({ content: 'Use this in the ticket channel.', ephemeral: true });
    await ch.send('Ticket closing — this channel will be deleted in 5 seconds.');
    setTimeout(()=> ch.delete().catch(()=>null), 5000);
    await interaction.reply({ content: 'Closing ticket...', ephemeral: true });
  }
};
