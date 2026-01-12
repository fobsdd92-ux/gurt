import db from '../db.js';
import { updateTicketStatus } from '../utils/ticketUtils.js';
export default (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    const id = interaction.customId;
    if (id === 'ticket_claim') {
      if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID) && !interaction.member.permissions.has('ManageGuild')) {
        return interaction.reply({ content: 'Only staff can claim tickets.', ephemeral: true });
      }
      const newName = `🟢-${interaction.channel.name.split('-').slice(1).join('-')}`.slice(0,90);
      await interaction.channel.setName(newName).catch(()=>null);
      updateTicketStatus(interaction.channel.id, 'claimed', interaction.user.id);
      await interaction.channel.send(`🟢 Ticket claimed by <@${interaction.user.id}>`);
      return interaction.reply({ content: 'Ticket claimed.', ephemeral: true });
    }
    if (id === 'ticket_hold') {
      if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID) && !interaction.member.permissions.has('ManageGuild')) {
        return interaction.reply({ content: 'Only staff can set on-hold.', ephemeral: true });
      }
      const newName = `🟡-${interaction.channel.name.split('-').slice(1).join('-')}`.slice(0,90);
      await interaction.channel.setName(newName).catch(()=>null);
      updateTicketStatus(interaction.channel.id, 'on-hold', '');
      await interaction.channel.send('🟡 Ticket set to On-Hold.');
      return interaction.reply({ content: 'Ticket set to on-hold.', ephemeral: true });
    }
    if (id === 'ticket_reqclose') {
      await interaction.channel.send(`Close requested by <@${interaction.user.id}>. Staff can close with /ticketclose.`);
      return interaction.reply({ content: 'Close request noted.', ephemeral: true });
    }
    if (id === 'ticket_close') {
      if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID) && !interaction.member.permissions.has('ManageGuild')) {
        return interaction.reply({ content: 'Only staff can close tickets.', ephemeral: true });
      }
      await interaction.channel.send('Ticket closing — this channel will be deleted in 5 seconds.');
      setTimeout(()=> interaction.channel.delete().catch(()=>null), 5000);
      return interaction.reply({ content: 'Closing ticket...', ephemeral: true });
    }
    const btnRow = db.prepare('SELECT * FROM embed_buttons WHERE id = ?').get(id);
    if (btnRow) {
      return interaction.reply({ content: btnRow.private_text, ephemeral: true });
    }
  });
};
