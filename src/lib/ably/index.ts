import {Realtime} from 'ably';
import Config from 'react-native-config';

// Job offers arrive through Ably. If the build has no key, run without
// live offers instead of crashing at start-up.
export const ably: Realtime | null = Config.ABLY_KEY
  ? new Realtime(Config.ABLY_KEY)
  : null;

export const subscribeToChannel = (
  channelName: string,
  callback: (data: any) => void,
) => {
  if (!ably) {
    return;
  }
  const channel: any = ably.channels.get(channelName);
  channel.subscribe('message', (message: {data: any}) => {
    callback(message.data);
  });
};
