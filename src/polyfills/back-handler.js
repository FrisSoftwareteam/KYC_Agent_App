// React Native 0.77 removed BackHandler.removeEventListener. Some UI libraries
// (gluestack / react-native-aria pop-ups) still call it, which crashes the app.
// This puts it back, using the subscription that addEventListener returns.
import {BackHandler} from 'react-native';

if (typeof BackHandler.removeEventListener !== 'function') {
  const subscriptions = new Map();
  const originalAdd = BackHandler.addEventListener.bind(BackHandler);
  BackHandler.addEventListener = (eventName, handler) => {
    const subscription = originalAdd(eventName, handler);
    subscriptions.set(handler, subscription);
    return {
      remove: () => {
        subscription.remove();
        subscriptions.delete(handler);
      },
    };
  };
  BackHandler.removeEventListener = (eventName, handler) => {
    const subscription = subscriptions.get(handler);
    if (subscription) {
      subscription.remove();
      subscriptions.delete(handler);
    }
  };
}
