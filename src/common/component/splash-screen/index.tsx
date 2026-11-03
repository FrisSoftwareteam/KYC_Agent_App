import React, {useEffect} from 'react';
import {theme} from '@/providers/theme-provider';
import {Center, StatusBar, Text, View} from '@gluestack-ui/themed';
import PrimaryWhitelogo from '@/assets/svgs/primary-white-logo';
import {useAppDispatch} from '@/common/hooks/redux';
import {
  setNotificationPermission,
  setLocationPermission,
  setpermissionIsOpen,
} from '@/lib/ably/slice';
import {AppState, PermissionsAndroid, Platform} from 'react-native';

const P = PermissionsAndroid.PERMISSIONS;
// Notification permission only exists from Android 13 (API 33). On older phones
// notifications are allowed by default, so we must not wait for it.
const needsNotificationPermission =
  Platform.OS === 'android' && Number(Platform.Version) >= 33;

async function currentPermissions() {
  const notification = needsNotificationPermission
    ? await PermissionsAndroid.check(P.POST_NOTIFICATIONS)
    : true;
  const fine = await PermissionsAndroid.check(P.ACCESS_FINE_LOCATION);
  const coarse = await PermissionsAndroid.check(P.ACCESS_COARSE_LOCATION);
  return {notification, location: fine || coarse};
}

export function SplashScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const apply = (p: {notification: boolean; location: boolean}) => {
      dispatch(setNotificationPermission(p.notification));
      dispatch(setLocationPermission(p.location));
      // Show the explanation (with a button to the phone's settings) until both are allowed.
      dispatch(setpermissionIsOpen(!(p.notification && p.location)));
    };

    const askThenCheck = async () => {
      try {
        if (needsNotificationPermission) {
          await PermissionsAndroid.request(P.POST_NOTIFICATIONS);
        }
        await PermissionsAndroid.requestMultiple([
          P.ACCESS_FINE_LOCATION,
          P.ACCESS_COARSE_LOCATION,
        ]);
      } catch (error) {
        // fall through to the check below
      }
      apply(await currentPermissions());
    };

    askThenCheck();

    // When the agent comes back from the phone's settings, check again so the app
    // carries on by itself instead of staying on this screen.
    const sub = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        apply(await currentPermissions());
      }
    });
    return () => sub.remove();
  }, [dispatch]);

  return (
    <View bg={theme.colors.primary.DEFAULT} h={'$full'} w={'$full'}>
      <StatusBar backgroundColor={theme.colors.primary.DEFAULT} />
      <Center h={'$full'} gap={'$12'}>
        <PrimaryWhitelogo />
        <Text
          color={theme.colors.primary.white}
          fontWeight={'bold'}
          size={'xl'}
          fontStyle={'italic'}
          fontFamily={'Ubuntu'}>
          CléCheck Agent
        </Text>
      </Center>
    </View>
  );
}
