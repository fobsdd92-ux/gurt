import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import db from '../db.js';
import { buildEmbedFromOptions } from '../utils/embedBuilder.js';
import { v4 as uuidv4 } from 'uuid';
export default {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure bot settings')
    .addSubcommand(s => s.setName('permissions').setDescription('Set command permissions')
      .addStringOption(o => o.setName('command').setDescription('Command name').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role to add').setRequired(false))
      .addUserOption(o => o.setName('user').setDescription('User to add').setRequired(false))
    )
    .addSubcommand(s => s.setName('setmessage').setDescription('Send a custom message to a channel')
      .addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true))
      .addStringOption(o => o.setName('message').setDescription('Message').setRequired(true))
    )
    .addSubcommand(s => s.setName('embed').setDescription('Create an embed')
      .addStringOption(o => o.setName('title').setDescription('Title'))
      .addStringOption(o => o.setName('description').setDescription('Description'))
      .addStringOption(o => o.setName('color').setDescription('Color hex'))
      .addStringOption(o => o.setName('footer').setDescription('Footer'))
      .addStringOption(o => o.setName('image').setDescription('Image URL'))
      .addStringOption(o => o.setName('thumbnail').setDescription('Thumbnail URL'))
      .addStringOption(o => o.setName('author').setDescription('Author name'))
      .addStringOption(o => o.setName('authoricon').setDescription('Author icon URL'))
      .addChannelOption(o => o.setName('channel').setDescription('Channel to post in').setRequired(true))
    )
    .addSubcommand(s => s.setName('embedbuttons').setDescription('Create a button for an embed that replies privately')
      .addStringOption(o => o.setName('label').setDescription('Button label').setRequired(true))
      .addStringOption(o => o.setName('text').setDescription('Private text shown when clicked').setRequired(true))
      .addChannelOption(o => o.setName('channel').setDescription('Channel to post button/embed in').setRequired(true))
    ),
  requirePermission: true,
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'permissions') {
      const command = interaction.options.getString('command', true);
      const role = interaction.options.getRole('role');
      const user = interaction.options.getUser('user');
      const row = db.prepare('SELECT json FROM config WHERE key = ?').get('permissions');
      const perms = row ? JSON.parse(row.json) : {};
      if (!perms[command]) perms[command] = { roles: [], users: [] };
      if (role && !perms[command].roles.includes(role.id)) perms[command].roles.push(role.id);
      if (user && !perms[command].users.includes(user.id)) perms[command].users.push(user.id);
      db.prepare('INSERT OR REPLACE INTO config (key, json) VALUES (?, ?)').run('permissions', JSON.stringify(perms));
      return interaction.reply({ content: `Permissions updated for /${command}`, ephemeral: true });
    }
    if (sub === 'setmessage') {
      const channel = interaction.options.getChannel('channel', true);
      const msg = interaction.options.getString('message', true);
      await channel.send({ content: msg }).catch(()=>null);
      return interaction.reply({ content: `Message sent to ${channel}`, ephemeral: true });
    }
    if (sub === 'embed') {
      const channel = interaction.options.getChannel('channel', true);
      const opts = {
        title: interaction.options.getString('title'),
        description: interaction.options.getString('description'),
        color: interaction.options.getString('color'),
        footer: interaction.options.getString('footer'),
        image: interaction.options.getString('image'),
        thumbnail: interaction.options.getString('thumbnail'),
        author: interaction.options.getString('author'),
        authoricon: interaction.options.getString('authoricon'),
        url: interaction.options.getString('url')
      };
      const embed = buildEmbedFromOptions(opts);
      await channel.send({ embeds: [embed] }).catch(()=>null);
      return interaction.reply({ content: `Embed posted to ${channel}`, ephemeral: true });
    }
    if (sub === 'embedbuttons') {
      const channel = interaction.options.getChannel('channel', true);
      const label = interaction.options.getString('label', true);
      const text = interaction.options.getString('text', true);
      const id = `embedbtn_${uuidv4()}`;
      db.prepare('INSERT INTO embed_buttons (id, label, private_text) VALUES (?, ?, ?)').run(id, label, text);
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(ButtonStyle.Primary)
      );
      await channel.send({ content: 'Interactive button (private reply):', components: [row] }).catch(()=>null);
      return interaction.reply({ content: `Button created in ${channel}`, ephemeral: true });
    }
  }
};
