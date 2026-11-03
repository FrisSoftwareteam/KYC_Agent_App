import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export async function requestUserPermission() {
  // Android 13+ needs the user's permission before any notification can show
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    return;
  }
}

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // console.log('ln 17 notify', remoteMessage);
    return remoteMessage;
  });

  // Check whether an initial notification is available
  messaging().getInitialNotification();
  // .then(remoteMessage => {
  //   if (remoteMessage) {

  //   }
  // });
};

// Returns the device's push token, or null if it cannot be obtained.
// Login must still work without it (the agent just won't get push notifications).
export const getToken = async (): Promise<string | null> => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    return await messaging().getToken();
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.warn(
      'Push notification token not available:',
      error?.message || error,
    );
    return null;
  }
};
