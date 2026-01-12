import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('ordermenu')
    .setDescription('Post the orders dropdown menu'),
  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('order_select')
      .setPlaceholder('Choose an order type')
      .addOptions([
        { label: 'Livery Orders', value: 'livery' },
        { label: 'ELS Orders', value: 'els' },
        { label: 'Embed Orders', value: 'embed' },
        { label: 'Discord Orders', value: 'discord' },
        { label: 'Clothing Orders', value: 'clothing' },
        { label: 'Graphics Orders', value: 'graphics' },
        { label: 'Bot Orders', value: 'bot' },
        { label: 'Photography Orders', value: 'photo' },
        { label: 'GFX', value: 'gfx' }
      ]);
    const row = new ActionRowBuilder().addComponents(menu);
    await interaction.reply({ content: '📫 Order menu — choose an order type:', components: [row] });
  }
};
