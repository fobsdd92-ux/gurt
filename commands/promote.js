import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('promote')
    .setDescription('Promote staff (give a role)')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role to give').setRequired(true)),
  requirePermission: true,
  async execute(interaction) {
    const u = interaction.options.getUser('user', true);
    const role = interaction.options.getRole('role', true);
    const member = await interaction.guild.members.fetch(u.id).catch(()=>null);
    if (!member) return interaction.reply({ content: 'Member not found.', ephemeral: true });
    await member.roles.add(role).catch(()=>null);
    await interaction.reply({ content: `Promoted <@${u.id}> — added role ${role.name}`, ephemeral: true });
  }
};
