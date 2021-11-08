import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import {
  DiscordChannel,
  Twitch,
  Youtube,
} from '../database/models/notifications';
import { youtubeEventEmmiter } from '../eventEmmiters/notifications';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notifications')
    .setDescription('Handles youtube and twitch notifications.')
    .addSubcommandGroup((group) =>
      group
        .setName('add')
        .setDescription('add twitch or youtube notifications')
        .addSubcommand((command) =>
          command
            .setName('twitch')
            .setDescription('add notifications for twitch')
            .addStringOption((str) =>
              str
                .setName('channel')
                .setDescription('channel to add')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('youtube')
            .setDescription('add notifications for youtube')
            .addStringOption((str) =>
              str
                .setName('channel')
                .setDescription('channel to add')
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName('remove')
        .setDescription('remove twitch or youtube notifications')
        .addSubcommand((command) =>
          command
            .setName('twitch')
            .setDescription('remove notifications for twitch')
            .addStringOption((str) =>
              str
                .setName('channel')
                .setDescription('channel to remove')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('youtube')
            .setDescription('remove notifications for youtube')
            .addStringOption((str) =>
              str
                .setName('channel')
                .setDescription('channel to remove')
                .setRequired(true)
            )
        )
    )
    .addSubcommand((command) =>
      command
        .setName('channels')
        .setDescription(
          'Returns a list of all channels sending notifications to this channel'
        )
    )
    .addSubcommand((command) =>
      command
        .setName('setrole')
        .setDescription('Sets the Role')
        .addRoleOption((role) =>
          role.setName('role').setDescription('The role').setRequired(true)
        )
    ),
  help: 'Handles youtube and twitch notifications.',
  useage: '/notifications [add/remove] [twitch/youtube] [channel]',
  permission: 'ADMINISTRATOR',
  async execute(interaction: CommandInteraction) {
    //console.log(interaction.options.data[0].options);
    await interaction.deferReply({ ephemeral: true });
    const action = interaction.options.data[0].name;

    if (action !== 'setrole' && action !== 'channels') {
      const platform: any = interaction.options!.data![0].options![0].name;
      const channel: any =
        interaction.options!.data![0].options![0].options![0].value;

      if (action === 'add' && platform === 'twitch') {
        const discordChannel = new DiscordChannel({
          guildId: interaction.guildId,
          channelId: interaction.channelId,
        });
        let twitchNotif = await Twitch.findOne({
          notificationChannel: channel.toLowerCase(),
        });
        if (!twitchNotif)
          twitchNotif = new Twitch({
            notificationChannel: channel.toLowerCase(),
          });
        if (
          !twitchNotif.discordChannels.some(
            (e: any) =>
              e.guildId == interaction.guildId &&
              e.channelId == interaction.channelId
          )
        )
          twitchNotif.discordChannels.push(discordChannel);
        twitchNotif.save();
        await interaction.editReply('Added twitch channel!');
      }
      if (action === 'add' && platform === 'youtube') {
        const discordChannel = new DiscordChannel({
          guildId: interaction.guildId,
          channelId: interaction.channelId,
        });
        let youtubeNotif = await Youtube.findOne({
          notificationChannel: channel,
        });
        if (!youtubeNotif)
          youtubeNotif = new Youtube({ notificationChannel: channel });
        if (
          !youtubeNotif.discordChannels.some(
            (e: any) =>
              e.guildId == interaction.guildId &&
              e.channelId == interaction.channelId
          )
        )
          youtubeNotif.discordChannels.push(discordChannel);
        youtubeNotif.save();
        youtubeEventEmmiter.emit('subscribe', channel);
        await interaction.editReply('Added youtube channel!');
      }
      if (action === 'remove' && platform === 'twitch') {
        let twitchNotif = await Twitch.findOne({
          notificationChannel: channel.toLowerCase(),
        });
        if (!twitchNotif) return await interaction.editReply('Error');
        if (
          !twitchNotif.discordChannels.some(
            (e: any) =>
              e.guildId == interaction.guildId &&
              e.channelId == interaction.channelId
          )
        )
          return await interaction.editReply('Error');
        const index = twitchNotif.discordChannels.findIndex(
          (e: any) =>
            e.guildId == interaction.guildId &&
            e.channelId == interaction.channelId
        );
        twitchNotif.discordChannels.splice(index, 1);
        twitchNotif.save();
        await interaction.editReply('Removed twitch channel!');
      }
      if (action === 'remove' && platform === 'youtube') {
        let youtubeNotif = await Youtube.findOne({
          notificationChannel: channel,
        });
        if (!youtubeNotif) return await interaction.editReply('Error');
        if (
          !youtubeNotif.discordChannels.some(
            (e: any) =>
              e.guildId == interaction.guildId &&
              e.channelId == interaction.channelId
          )
        )
          return await interaction.editReply('Error');
        const index = youtubeNotif.discordChannels.findIndex(
          (e: any) =>
            e.guildId == interaction.guildId &&
            e.channelId == interaction.channelId
        );
        youtubeNotif.discordChannels.splice(index, 1);
        youtubeNotif.save();
        await interaction.editReply('Removed twitch channel!');
      }
    }
    if (action === 'channels') {
      const youtube = (await Youtube.find()).filter((elm) =>
        elm.discordChannels.some(
          (e: any) =>
            e.channelId === interaction.channelId &&
            e.guildId === interaction.guildId
        )
      );
      const twitch = (await Twitch.find()).filter((elm) =>
        elm.discordChannels.some(
          (e: any) =>
            e.channelId === interaction.channelId &&
            e.guildId === interaction.guildId
        )
      );
      interaction.editReply(`Twitch Channels: ${twitch.reduce(
        (acc, ele) => `${acc}${ele.notificationChannel}, `,
        ''
      )}
Youtube Channels: ${youtube.reduce(
        (acc, ele) => `${acc}${ele.notificationChannel}, `,
        ''
      )}`);
    }
    if (action === 'setrole') {
      const role = interaction.options.getRole('role')!;
      if (role.name === '@everyone') {
        return await DiscordChannel.deleteOne({
          guildId: interaction.guildId,
          channelId: interaction.channelId,
        });
      }
      let discordchannel = await DiscordChannel.findOneAndUpdate(
        { guildId: interaction.guildId, channelId: interaction.channelId },
        {
          guildId: interaction.guildId,
          channelId: interaction.channelId,
          roleId: role.id,
        }
      );
      if (!discordchannel) {
        discordchannel = new DiscordChannel({
          guildId: interaction.guildId,
          channelId: interaction.channelId,
          roleId: role.id,
        });
      }
      discordchannel.save();
      interaction.editReply('Updated Ping Role!');
    }
  },
};
