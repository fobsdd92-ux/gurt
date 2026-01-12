import { hasPermission } from '../utils/permissionCheck.js';
export default (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return;
        if (cmd.requirePermission && !hasPermission(interaction.member, cmd.data.name)) {
          return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        await cmd.execute(interaction, client);
      }
    } catch (err) {
      console.error('Interaction handler error', err);
      if (interaction.replied || interaction.deferred) {
        try { await interaction.followUp({ content: 'An internal error occurred.', ephemeral: true }); } catch {}
      } else {
        try { await interaction.reply({ content: 'An internal error occurred.', ephemeral: true }); } catch {}
      }
    }
  });
};
