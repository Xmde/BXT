import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import fs from 'fs';

// Command which gets all the help info from commands and sends it to the user in an embed.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help Command'),
  help: 'this',
  useage: '/help',
  async execute(interaction: CommandInteraction) {
    //Creates the embed message to send to user
    const helpEmbed = new MessageEmbed()
      .setColor('#b31d45')
      .setAuthor('Help Command')
      .setTimestamp()
      .setFooter('BXT (Developed by Xmde#1337)');

    //Looks for all the commands.
    const commandFiles = fs
      .readdirSync(__dirname)
      .filter((file) => file.endsWith('.js'));

    //For each command adds a field to the embed with the help and useage tag.
    for (const file of commandFiles) {
      const command = require(`./${file}`);
      helpEmbed.addField(`\`\`\`${command.useage}\`\`\``, command.help);
    }

    //Sends the user the help message.
    (interaction.member as GuildMember).send({ embeds: [helpEmbed] });

    await interaction.reply({
      content: `Help Command Sent to DMs`,
      ephemeral: true,
    });
  },
};
