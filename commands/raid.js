const { SlashCommandBuilder } = require('@discordjs/builders');

// Simple Ping Command. Responds with pong.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('raid')
    .setDescription('Enables or disables the server raid mode')
    .addSubcommand((command) =>
      command.setName('on').setDescription('Enable Raid Mode')
    )
    .addSubcommand((command) =>
      command.setName('off').setDescription('Disable Raid Mode')
    ),
  help: 'Enable or disable the server raid mode',
  useage: '/raid [on/off]',
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === 'on') {
      interaction.guild.edit(
        { verificationLevel: 'HIGH' },
        'Enabled Raid Mode'
      );
      interaction.reply('Enable Raid Mode');
    } else if (subCommand === 'off') {
      interaction.guild.edit(
        { verificationLevel: 'LOW' },
        'Disabled Raid Mode'
      );
      interaction.reply('Disabled Raid Mode');
    } else {
      throw new Error('Invalid subCommand');
    }
  },
};
