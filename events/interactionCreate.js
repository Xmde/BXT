module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const client = interaction.client;
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
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      try {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } catch (error) {
        await interaction.editReply({
          content: 'There was an error while executing this command!',
        });
      }
    }
  },
};
