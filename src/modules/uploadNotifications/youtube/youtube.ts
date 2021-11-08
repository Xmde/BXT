import { Client, TextChannel } from 'discord.js';
import { youtubeEventEmmiter } from '../../../eventEmmiters/notifications';
import { subscribe, renew } from './pubsubhubbub';
import xml2js from 'xml2js';
import {
  Youtube,
  DiscordChannel,
} from '../../../database/models/notifications';

require('./pubsubhubbub').init();

export default async function (client: Client) {
  youtubeEventEmmiter.on('subscribe', (data: string) => {
    subscribe(data);
  });
  youtubeEventEmmiter.on('newVideo', async (feed: any) => {
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
}

const sendNotifications = async (data: any, client: Client) => {
  const databaseInfo = await Youtube.findOne({
    notificationChannel: data.feed.entry[0]['yt:channelId'],
  });
  databaseInfo.discordChannels.forEach(async (channel: any) => {
    const pingRole = await DiscordChannel.findOne({
      guildId: channel.guildId,
      channelId: channel.channelId,
    });
    if (!pingRole) {
      return (
        client.channels.cache.get(channel.channelId)! as TextChannel
      ).send(
        `@everyone ${data.feed.entry[0].author[0].name} just uploaded a YouTube video! Go check out their video!\n${data.feed.entry[0].link[0].href}`
      );
    }
    (client.channels.cache.get(channel.channelId)! as TextChannel).send(
      `<@&${pingRole.roleId}> ${data.feed.entry[0].author[0].name} just uploaded a YouTube video! Go check out their video!\n${data.feed.entry[0].link[0].href}`
    );
  });
};
