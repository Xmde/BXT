const TwitchApi = require('node-twitch').default;
const config = require('config');

const twitch = new TwitchApi({
  client_id: config.get('TwitchClientId'),
  client_secret: config.get('TwitchClientSecret'),
});

async function getStreams(usernames) {
  let streams = await twitch.getStreams({
    channels: usernames,
    first: 100,
  });
  return streams.data;
}

async function getStreamsBulk(bulkUsernames) {
  let streams = [];
  while (bulkUsernames.length) {
    let usernames = bulkUsernames.splice(0, 95);
    streams.push(...(await getStreams(usernames)));
  }
  return streams;
}

exports.getStreams = getStreams;
exports.getStreamsBulk = getStreamsBulk;
