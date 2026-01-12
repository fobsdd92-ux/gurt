import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder().setName('status').setDescription('Bot status'),
  async execute(interaction) {
    const uptime = Math.floor(process.uptime());
    await interaction.reply({ content: `Bot is online. Uptime: ${uptime}s`, ephemeral: true });
  }
};
