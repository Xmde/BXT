const { youtubeEventEmmiter } = require('../../../eventEmmiters/notifications');
const { subscribe, unsubscribe, renew } = require('./pubsubhubbub');
const xml2js = require('xml2js');
const {
  Youtube,
  DiscordChannel,
} = require('../../../database/models/notifications');

require('./pubsubhubbub').init();

module.exports = async function (client) {
  youtubeEventEmmiter.on('subscribe', (data) => {
    subscribe(data);
  });
  youtubeEventEmmiter.on('unsubscribe', (data) => {
    unsubscribe(data);
  });
  youtubeEventEmmiter.on('newVideo', async (feed) => {
    const data = await xml2js.parseStringPromise(feed.feed.toString(), {
      mergeAttrs: true,
    });
    if (!data.feed.entry) return;
    sendNotifications(data, client);
  });
  setInterval(async () => {
    const channels = (await Youtube.find())
      .filter((ele) => ele.discordChannels.length > 0)
      .reduce((acc, elm) => {
        return [...acc, elm.notificationChannel];
      }, []);
    renew(channels);
  }, 1000 * 60 * 60 * 24 * 2);
};

const sendNotifications = async (data, client) => {
  const databaseInfo = await Youtube.findOne({
    notificationChannel: data.feed.entry[0]['yt:channelId'],
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
          `@everyone ${data.feed.entry[0].author[0].name} just uploaded a YouTube video! Go check out their video!\n${data.feed.entry[0].link[0].href}`
        );
    }
    client.channels.cache
      .get(channel.channelId)
      .send(
        `<@&${pingRole.roleId}> ${data.feed.entry[0].author[0].name} just uploaded a YouTube video! Go check out their video!\n${data.feed.entry[0].link[0].href}`
      );
  });
};
