const { SlashCommandBuilder } = require('@discordjs/builders');

//Function that allowes for a delay command.
const delay = require('../utils/delay');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rollercoaster')
    .setDescription('Make User go WHOOOOO')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User that goes WHOOOOO')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('time')
        .setDescription('How long shall it last')
        .setRequired(true)
    ),
  help: 'Makes User go WHOOOOO',
  useage: '/rollercoaster [user] [time]',
  permission: 'ADMINISTRATOR',
  async execute(interaction, client) {
    const guild = client.guilds.cache.get(interaction.guildId);
    const user = guild.members.cache.get(
      interaction.options.getUser('user').id
    );
    //Checks to make sure that the time given is less than 15 and greater than 0
    if (
      interaction.options.getInteger('time') > 15 ||
      interaction.options.getInteger('time') <= 0
    ) {
      interaction.reply({
        content: 'Enter a time between 0 and 15 seconds!',
        ephemeral: true,
      });
      return;
    }

    //Gets a bunch of usefull info from discord.
    const originalChannel = user.voice.channel;
    const voiceChannels = (await guild.channels.fetch()).filter(
      (channel) => channel.type === 'GUILD_VOICE'
    );

    //Checks to see if the user is in a channel.
    if (!originalChannel) {
      interaction.reply({
        content: 'That user is not in a channel!',
        ephemeral: true,
      });
      return;
    }

    //Checks to makre sure that there are more than 2 channels in the discord server.
    if (voiceChannels.size < 3) {
      interaction.reply({
        content: 'You need more voice channels in this server.',
        ephemeral: true,
      });
      return;
    }

    interaction.reply('Have Fun!');
    let randomChannel = originalChannel;

    //Loop which gets a random voice channel and move the user to it.
    for (let i = 0; i < interaction.options.getInteger('time') * 2; i++) {
      randomChannel = voiceChannels
        .filter((c) => c.id !== randomChannel.id)
        .random();
      user.voice.setChannel(randomChannel);
      await delay(500);
    }

    //Sets the user back to the original channel.
    user.voice.setChannel(originalChannel);
    await delay(3000);
    try {
      interaction.deleteReply();
    } catch {}
  },
};
