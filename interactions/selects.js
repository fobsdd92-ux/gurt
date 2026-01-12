import db from '../db.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } from 'discord.js';
import { formatTicketName, saveTicket } from '../utils/ticketUtils.js';
export default (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'order_select') {
      const orderType = interaction.values[0];
      const ORDERS_CATEGORY_ID = process.env.ORDERS_CATEGORY_ID;
      const opener = interaction.user;
      const channelName = formatTicketName('🔴', orderType, opener.username);
      const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: ORDERS_CATEGORY_ID,
        permissionOverwrites: [
          { id: interaction.guild.roles.everyone, deny: ['ViewChannel'] }
        ]
      });
      saveTicket(channel.id, opener.id, orderType);
      const embed = new EmbedBuilder()
        .setTitle(`${orderType.toUpperCase()} Ticket`)
        .setDescription(`Status: 🔴 Unclaimed\nOpened by: <@${opener.id}>`)
        .setTimestamp();
      const claimBtn = new ButtonBuilder().setCustomId('ticket_claim').setLabel('Claim').setStyle(ButtonStyle.Primary);
      const holdBtn = new ButtonBuilder().setCustomId('ticket_hold').setLabel('On-Hold').setStyle(ButtonStyle.Secondary);
      const reqCloseBtn = new ButtonBuilder().setCustomId('ticket_reqclose').setLabel('Request Close').setStyle(ButtonStyle.Secondary);
      const closeBtn = new ButtonBuilder().setCustomId('ticket_close').setLabel('Close').setStyle(ButtonStyle.Danger);
      const row = new ActionRowBuilder().addComponents(claimBtn, holdBtn, reqCloseBtn, closeBtn);
      await channel.send({ content: `<@${opener.id}>`, embeds: [embed], components: [row] });
      await interaction.reply({ content: `Ticket created: <#${channel.id}>`, ephemeral: true });
    }
  });
};
