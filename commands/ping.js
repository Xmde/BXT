const { SlashCommandBuilder } = require('@discordjs/builders');

// Simple Ping Command. Responds with pong.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  help: 'Replies with Pong when sent Ping',
  useage: '/ping',
  async execute(interaction, _) {
    await interaction.reply({
      content: `Pong!`,
      ephemeral: true,
    });
  },
};
