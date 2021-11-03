if (process.env.NODE_ENV === 'production') {
  require('dotenv').config();
  require('./deploy_commands').production();
}

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('config');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

// Get all the commands and puts them into a collection
// Allowed for better command handleling.
client.commands = new Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(config.get('BotToken'));
