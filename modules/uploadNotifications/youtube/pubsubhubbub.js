const pubSubHubbub = require('pubsubhubbub');
const config = require('config');
const { youtubeEventEmmiter } = require('../../../eventEmmiters/notifications');

const pubSubSubscriber = pubSubHubbub.createServer({
  callbackUrl: config.get('CallBackUrl'),
});
exports.init = function () {
  pubSubSubscriber.listen(config.get('CallBackUrlPort'));
  pubSubSubscriber.on('subscribe', function (data) {
    console.log(data.topic + ' subscribed');
  });
  pubSubSubscriber.on('feed', (data) => {
    youtubeEventEmmiter.emit('newVideo', data);
  });
};

function subscribe(channel) {
  pubSubSubscriber.subscribe(
    `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channel}`,
    'https://pubsubhubbub.appspot.com/',
    config.get('CallBackUrl'),
    (err) => {
      if (err) console.log(chalk.bgRed.bold(`[ERROR] ${err}`));
    }
  );
}

exports.subscribe = subscribe;

exports.renew = function (channels) {
  for (channel of channels) subscribe(channel);
};
