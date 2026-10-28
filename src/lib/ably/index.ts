import {Realtime} from 'ably';
import Config from 'react-native-config';

// Job offers arrive through Ably. If the build has no key, run without
// live offers instead of crashing at start-up.
// WebSocket only: the fallback (long polling over XHR) kept timing out on phones,
// so the app never connected and offers never arrived.
export const ably: Realtime | null = Config.ABLY_KEY
  ? new Realtime({
      key: Config.ABLY_KEY,
      transports: ['web_socket'],
      disconnectedRetryTimeout: 5000,
      suspendedRetryTimeout: 15000,
    })
  : null;

ably?.connection.on(change => {
  // eslint-disable-next-line no-console
  console.warn(`Ably connection: ${change.previous} -> ${change.current}`);
});

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
