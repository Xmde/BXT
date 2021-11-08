//API Handle for Twitch
import TwitchApi from 'node-twitch';

const twitch = new TwitchApi({
  client_id: process.env.BXT_twitchClientId!,
  client_secret: process.env.BXT_twitchClientSecret!,
});

export async function getStreams(usernames: string[]) {
  let streams = await twitch.getStreams({
    channels: usernames,
    first: 100,
  });
  return streams.data;
}

export async function getStreamsBulk(bulkUsernames: string[]) {
  let streams = [];
  while (bulkUsernames.length) {
    let usernames = bulkUsernames.splice(0, 95);
    streams.push(...(await getStreams(usernames)));
  }
  return streams;
}
