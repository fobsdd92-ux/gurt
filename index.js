import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import db from './db.js';
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('Please set TOKEN, CLIENT_ID, and GUILD_ID in .env');
  process.exit(1);
}
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
// load commands
const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
const restCommands = [];
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  const cmd = command.default;
  if (!cmd || !cmd.data) continue;
  client.commands.set(cmd.data.name, cmd);
  restCommands.push(cmd.data.toJSON());
}
// register commands
import { REST as RESTv } from 'discord.js';
const rest = new RESTv({ version: '10' }).setToken(TOKEN);
await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: restCommands });
console.log('Registered commands:', restCommands.map(c => c.name).join(', '));
// load events
const eventsPath = path.join(process.cwd(), 'events');
for (const f of fs.readdirSync(eventsPath).filter(x => x.endsWith('.js'))) {
  const evt = await import(`file://${path.join(eventsPath, f)}`);
  evt.default(client);
}
// load interaction handlers
await import(`file://${path.join(process.cwd(),'interactions','buttons.js')}`);
await import(`file://${path.join(process.cwd(),'interactions','selects.js')}`);
client.login(TOKEN);
