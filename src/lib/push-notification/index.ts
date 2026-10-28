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

type TOffer = {
  verificationId: string;
  addressId: string;
  address: string;
  landmark?: string;
  distance?: string;
  price?: string;
  turnarroundTime?: string;
  candidate: {firstName: string; lastName: string; phoneNumber: string};
};

const OFFER_MAX_AGE_MS = 15 * 60 * 1000;

// Turns a job-offer push notification into the same offer the in-app popup shows.
const toOffer = (remoteMessage: any): TOffer | null => {
  const d = remoteMessage?.data;
  if (!d?.addressId || !d?.verificationId) {
    return null;
  }
  const sent = Number(remoteMessage?.sentTime);
  if (sent && Date.now() - sent > OFFER_MAX_AGE_MS) {
    return null;
  }
  return {
    verificationId: String(d.verificationId),
    addressId: String(d.addressId),
    address: String(d.address || ''),
    landmark: d.landmark,
    distance: d.distance,
    price: d.price,
    turnarroundTime: d.turnarroundTime,
    candidate: {
      firstName: d.candidateFirstName || '',
      lastName: d.candidateLastName || '',
      phoneNumber: d.candidatePhoneNumber || '',
    },
  };
};

// When the agent taps a job-offer notification (app in the background or closed),
// open the offer so they can accept it. Before, tapping it opened the app and showed nothing.
export const notificationListener = (onOffer?: (offer: TOffer) => void) => {
  const handle = (remoteMessage: any) => {
    const offer = toOffer(remoteMessage);
    if (offer && onOffer) {
      onOffer(offer);
    }
  };

  const unsubscribe = messaging().onNotificationOpenedApp(handle);
  // With the app open, show the offer from the push notification too. This is a second
  // way in, so offers still arrive when the live connection (Ably) is down.
  const unsubscribeForeground = messaging().onMessage(handle);

  messaging()
    .getInitialNotification()
    .then(handle)
    .catch(() => undefined);

  return () => {
    unsubscribe();
    unsubscribeForeground();
  };
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
