//Sets up database structure for notications
import mongoose from 'mongoose';

const discordChannelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  roleId: String,
});

const notificationSchema = new mongoose.Schema({
  notificationChannel: { type: String, required: true },
  discordChannels: [discordChannelSchema],
});

export const Twitch = mongoose.model('Twitch_Channel', notificationSchema);
export const Youtube = mongoose.model('Youtube_Channel', notificationSchema);
export const DiscordChannel = mongoose.model(
  'discordChannel',
  discordChannelSchema
);
