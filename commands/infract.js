import { SlashCommandBuilder } from 'discord.js';
import db from '../db.js';
export default {
  data: new SlashCommandBuilder()
    .setName('infract')
    .setDescription('Issue an infraction')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .addStringOption(o => o.setName('punishment').setDescription('Punishment').setRequired(false))
    .addStringOption(o => o.setName('notes').setDescription('Notes').setRequired(false))
    .addStringOption(o => o.setName('expiration').setDescription('Expiration').setRequired(false)),
  requirePermission: true,
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);
    const punishment = interaction.options.getString('punishment') || '';
    const notes = interaction.options.getString('notes') || '';
    const expiration = interaction.options.getString('expiration') || '';
    const info = db.prepare('INSERT INTO infractions (user_id, moderator_id, reason, punishment, notes, expiration, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)').run(user.id, interaction.user.id, reason, punishment, notes, expiration, Math.floor(Date.now()/1000));
    const caseId = info.lastInsertRowid;
    const infraChannelId = process.env.INFRACTIONS_LOG_CHANNEL_ID;
    if (infraChannelId) {
      const ch = await interaction.client.channels.fetch(infraChannelId).catch(()=>null);
      if (ch) ch.send({ content: `Infraction #${caseId} issued to <@${user.id}> by <@${interaction.user.id}> — ${reason}` }).catch(()=>null);
    }
    await interaction.reply({ content: `Infraction recorded. Case ID: ${caseId}`, ephemeral: true });
  }
};
