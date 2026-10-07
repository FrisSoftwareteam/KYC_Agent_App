import {Realtime} from 'ably';
import Config from 'react-native-config';

export const ably = new Realtime(Config.ABLY_KEY);

export const subscribeToChannel = (
  channelName: string,
  callback: (data: any) => void,
) => {
  const channel: any = ably.channels.get(channelName);
  channel.subscribe('message', (message: {data: any}) => {
    callback(message.data);
  });
};
