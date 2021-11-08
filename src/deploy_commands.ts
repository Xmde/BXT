import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const commands = [];

  const commandFiles = fs
    .readdirSync(path.join(__dirname, '/commands'))
    .filter((file: string) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '9' }).setToken(process.env.BXT_botToken!);

  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.BXT_clientId!,
        process.env.BXT_guildId!
      ),
      {
        body: commands,
      }
    )
    .then(() =>
      console.log('Successfully registered application commands. GUILD')
    )
    .catch(console.error);
}

export function production() {
  const commands = [];

  const commandFiles = fs
    .readdirSync('./commands')
    .filter((file: string) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '9' }).setToken(process.env.BXT_botToken!);

  rest
    .put(Routes.applicationCommands(process.env.BXT_clientId!), {
      body: commands,
    })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}
