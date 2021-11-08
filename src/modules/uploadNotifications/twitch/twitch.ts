import { Client, TextChannel } from 'discord.js';
import { Twitch, DiscordChannel } from '../../../database/models/notifications';
import { getStreamsBulk } from './apiHandle';

interface OldStream {
  id: string;
}

let oldStreams: OldStream[] = [];

export default async function (client: Client) {
  setInterval(async () => {
    const newStreams = await getNewStreams();
    if (newStreams.length === 0) return;
    for (const stream of newStreams) sendNotifications(stream, client);
  }, 1000 * 60);
}

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

const sendNotifications = async (stream: any, client: Client) => {
  //console.log(stream);
  const databaseInfo = await Twitch.findOne({
    notificationChannel: stream.user_login,
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
        `@everyone ${stream.user_name} is live on twitch! Go check our their stream!\nhttps://twitch.tv/${stream.user_login}`
      );
    }
    (client.channels.cache.get(channel.channelId)! as TextChannel).send(
      `<@&${pingRole.roleId}> ${stream.user_name} is live on twitch! Go check our their stream!\nhttps://twitch.tv/${stream.user_login}`
    );
  });
};
