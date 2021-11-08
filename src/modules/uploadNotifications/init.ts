import { Client } from 'discord.js';
import twitchInit from './twitch/twitch';
import youtubeInit from './youtube/youtube';

module.exports = function (client: Client) {
  twitchInit(client);
  youtubeInit(client);
};
