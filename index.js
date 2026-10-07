import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';

// // Set a background message handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   const {title, body} = remoteMessage?.notification || {};
//   return notifee.displayNotification({
//     title: title,
//     body: body,
//     android: {
//       channelId: 'default',
//       color: '#11406F',
//       smallIcon: 'notification_icon',
//       vibrationPattern: [300, 500, 800, 800],
//     },
//   });
// });

// Request necessary permissions

// Check if the app is running in the background
function HeadlessCheck({isHeadless}) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return isHeadless ? null : <App />;
}

// Register the main component
AppRegistry.registerComponent(appName, () => HeadlessCheck);
