//Sets up database structure for notications
const mongoose = require('mongoose');

const discordChannelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
});

const notificationSchema = new mongoose.Schema({
  notificationChannel: { type: String, required: true },
  discordChannels: [discordChannelSchema],
});

const TwitchNotification = mongoose.model('Twitch_Channel', notificationSchema);
const YoutubeNotification = mongoose.model(
  'Youtube_Channel',
  notificationSchema
);

const DiscordChannel = mongoose.model('discordChannel', discordChannelSchema);

exports.Twitch = TwitchNotification;
exports.Youtube = YoutubeNotification;
exports.DiscordChannel = DiscordChannel;
