import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('qc-check')
    .setDescription('Send a QC check to a channel')
    .addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true))
    .addStringOption(o => o.setName('notes').setDescription('Notes')),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel', true);
    const notes = interaction.options.getString('notes') || 'No notes';
    await channel.send({ content: `**Quality Control Check**\n${notes}` }).catch(()=>null);
    await interaction.reply({ content: `QC check sent to ${channel}`, ephemeral: true });
  }
};
