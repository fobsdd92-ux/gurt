import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Submit staff/design feedback')
    .addUserOption(o => o.setName('user').setDescription('Staff/design').setRequired(true))
    .addStringOption(o => o.setName('feedback').setDescription('Feedback').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('user', true);
    const fb = interaction.options.getString('feedback', true);
    if (process.env.FEEDBACK_CHANNEL_ID) {
      const ch = await interaction.client.channels.fetch(process.env.FEEDBACK_CHANNEL_ID).catch(()=>null);
      if (ch) ch.send({ content: `Feedback for <@${target.id}> from <@${interaction.user.id}>:\n${fb}` }).catch(()=>null);
    }
    await interaction.reply({ content: 'Feedback submitted.', ephemeral: true });
  }
};
