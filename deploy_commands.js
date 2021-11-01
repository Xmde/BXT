if (process.env.NODE_ENV === 'production') require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('config');

const commands = [];

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.get('BotToken'));

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
  rest
    .put(
      Routes.applicationGuildCommands(
        config.get('ClientId'),
        config.get('GuildId')
      ),
      {
        body: commands,
      }
    )
    .then(() =>
      console.log('Successfully registered application commands. GUILD')
    )
    .catch(console.error);
} else if (process.env.NODE_ENV == 'production') {
  rest
    .put(Routes.applicationCommands(config.get('ClientId')), { body: commands })
    .then(() =>
      console.log('Successfully registered application commands GLOBALY.')
    )
    .catch(console.error);
}
