if (process.env.NODE_ENV === 'production') require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('config');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// Get all the commands and puts them into a collection
// Allowed for better command handleling.
client.commands = new Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// On an interaction checks to see if it is a command.
// If it is a command then run appropiate command.
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  if (
    command.permission &&
    !interaction.member.permissions.has(command.permission)
  ) {
    interaction.reply({
      content: 'You do not have permission to run this command!',
      ephemeral: true,
    });
    return;
  }
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.on('ready', () => {
  console.log('Bot Ready!');
});

require('./database/init')();
require('./modules/uploadNotifications/init')(client);
client.login(config.get('BotToken'));
