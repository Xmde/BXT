import pubSubHubbub from 'pubsubhubbub';
import { youtubeEventEmmiter } from '../../../eventEmmiters/notifications';

const pubSubSubscriber = pubSubHubbub.createServer({
  callbackUrl: process.env.BXT_callBackUrl,
});
export function init() {
  pubSubSubscriber.listen(process.env.BXT_callBackUrlPort);
  pubSubSubscriber.on('subscribe', function (data: any) {
    console.log(data.topic + ' subscribed');
  });
  pubSubSubscriber.on('feed', (data: any) => {
    youtubeEventEmmiter.emit('newVideo', data);
  });
}

export function subscribe(channel: string) {
  pubSubSubscriber.subscribe(
    `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channel}`,
    'https://pubsubhubbub.appspot.com/',
    process.env.BXT_callBackUrl,
    (err: string) => {
      if (err) console.log(`[ERROR] ${err}`);
    }
  );
}

export function renew(channels: string[]) {
  for (const channel of channels) subscribe(channel);
}
