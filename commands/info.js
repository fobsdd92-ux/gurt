import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder().setName('info').setDescription('Server info'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} — Info`)
      .addFields(
        { name: 'Members', value: `${interaction.guild.memberCount}`, inline: true },
        { name: 'Owner', value: `<@${interaction.guild.ownerId}>`, inline: true },
        { name: 'ID', value: `${interaction.guild.id}`, inline: true }
      );
    await interaction.reply({ embeds: [embed], ephemeral: false });
  }
};
