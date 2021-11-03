module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    const owner = await guild.client.users.fetch(guild.ownerId);
    console.log(
      `Joined new Guild! Name(${guild.name}) | Owner(${owner.tag}) | ID(${guild.id})`
    );
  },
};
