module.exports = function (client) {
  require('./twitch/twitch')(client);
  require('./youtube/youtube')(client);
};
