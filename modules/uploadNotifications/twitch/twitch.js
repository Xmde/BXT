const {
  Twitch,
  DiscordChannel,
} = require('../../../database/models/notifications');
const { getStreamsBulk } = require('./apiHandle');

let oldStreams = [];

module.exports = async function (client) {
  setInterval(async () => {
    const newStreams = await getNewStreams();
    if (newStreams.length === 0) return;
    for (stream of newStreams) sendNotifications(stream, client);
  }, 1000 * 60);
};

async function getNewStreams() {
  const twitchNotifications = await Twitch.find();
  const streams = await getStreamsBulk(
    twitchNotifications.reduce((acc, val) => {
      return [...acc, val.notificationChannel];
    }, [])
  );
  const result = streams.filter(
    (stream) => !oldStreams.some((oldStream) => oldStream.id === stream.id)
  );
  oldStreams = [...oldStreams, ...result].filter((oldStream) =>
    streams.some((stream) => stream.id === oldStream.id)
  );
  return result;
}

const sendNotifications = async (stream, client) => {
  //console.log(stream);
  const databaseInfo = await Twitch.findOne({
    notificationChannel: stream.user_login,
  });
  databaseInfo.discordChannels.forEach(async (channel) => {
    const pingRole = await DiscordChannel.findOne({
      guildId: channel.guildId,
      channelId: channel.channelId,
    });
    if (!pingRole) {
      return client.channels.cache
        .get(channel.channelId)
        .send(
          `@everyone ${stream.user_name} is live on twitch! Go check our their stream!\nhttps://twitch.tv/${stream.user_login}`
        );
    }
    client.channels.cache
      .get(channel.channelId)
      .send(
        `<@&${pingRole.roleId}> ${stream.user_name} is live on twitch! Go check our their stream!\nhttps://twitch.tv/${stream.user_login}`
      );
  });
};
