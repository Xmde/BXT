const { SlashCommandBuilder } = require('@discordjs/builders');

// Command which deletes the last x messages.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes that last few messages')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('Number of messages to purge')
        .setRequired(true)
    ),
  help: 'Purges that last few messages',
  useage: '/purge [amount]',
  permission: 'ADMINISTRATOR',
  async execute(interaction, client) {
    // Gets a lot of useful info to be used later on.
    const ammount = interaction.options.getInteger('amount');
    const guild = client.guilds.cache.get(interaction.guildId);
    const channel = await guild.channels.fetch(interaction.channelId);
    const messages = await channel.messages.fetch({ limit: ammount });

    // Delete messages under 13.5 days efficiently
    channel.bulkDelete(
      messages.filter(
        (msg) => (Date.now() - msg.createdAt) / (1000 * 60 * 60 * 24) < 13.5
      )
    );

    // Delete messages older 13.5 days slowly but prevents breaks.
    messages
      .filter(
        (msg) => (Date.now() - msg.createdAt) / (1000 * 60 * 60 * 24) > 13.5
      )
      .each((msg) => msg.delete());

    interaction.reply({
      content: `${ammount} messages successfully deleted!`,
      ephemeral: true,
    });
  },
};
