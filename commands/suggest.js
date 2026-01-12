import { SlashCommandBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit a suggestion')
    .addStringOption(o => o.setName('suggestion').setDescription('Suggestion').setRequired(true)),
  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion', true);
    db.prepare('INSERT INTO suggestions (user_id, suggestion, timestamp) VALUES (?, ?, ?)').run(interaction.user.id, suggestion, Math.floor(Date.now()/1000));
    if (process.env.SUGGESTIONS_CHANNEL_ID) {
      const ch = await interaction.client.channels.fetch(process.env.SUGGESTIONS_CHANNEL_ID).catch(()=>null);
      if (ch) ch.send({ content: `New suggestion from <@${interaction.user.id}>:\n${suggestion}` }).catch(()=>null);
    }
    await interaction.reply({ content: 'Suggestion submitted. Thanks!', ephemeral: true });
  }
};
