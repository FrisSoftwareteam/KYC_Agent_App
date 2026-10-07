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
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';

export function SplashScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handlePermissions = async () => {
      try {
        const notification = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        dispatch(setNotificationPermission(notification === 'granted'));

        Geolocation.requestAuthorization(
          () => dispatch(setLocationPermission(true)),
          () => {
            dispatch(setLocationPermission(false));
            dispatch(setpermissionIsOpen(true));
          },
        );

        if (notification !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Notification Permission Not Granted');
        }
      } catch (error) {
        dispatch(setpermissionIsOpen(true));
      }
    };

    handlePermissions();
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
          Agent Apps
        </Text>
      </Center>
    </View>
  );
}
