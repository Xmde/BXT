require('dotenv').config();
if (process.env.NODE_ENV === 'production') {
  require('./deploy_commands').production();
}
import fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
import path from 'path';

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

// Get all the commands and puts them into a collection
// Allowed for better command handleling.
client.commands = new Collection();
const commandFiles = fs
  .readdirSync(path.join(__dirname, '/commands'))
  .filter((file: string) => file.endsWith('.js'));

// Get att the commands for events and put them into a collection
const eventFiles = fs
  .readdirSync(path.join(__dirname, '/events'))
  .filter((file: string) => file.endsWith('.js'));

// Adds commands to variable to be used later
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  console.log(`Registered command ${command.data.name}`);
}

// Calls event scripts on event triggers
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
  console.log(`Registered Event ${event.name}`);
}

client.on('ready', () => {
  console.log('Bot Ready!');
});

require('./database/init')();
//Setup Notificaitons Module
require('./modules/uploadNotifications/init')(client);
client.login(process.env.BXT_botToken);
