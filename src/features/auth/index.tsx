import {
  Button,
  ButtonText,
  Center,
  HStack,
  Pressable,
  StatusBar,
  View,
} from '@gluestack-ui/themed';
import React, {useState, useEffect} from 'react';
import {theme} from '@/providers/theme-provider';
import {SplashScreen} from '@/common/component/splash-screen';
import {TNavigation} from '@/common/types/navigation';
import {useNavigation} from '@react-navigation/native';
import {ERoutes} from '@/common/enum/routes';
import {AuthSwipe1, AuthSwipe2} from '@/common/component/swipeable';
import {useAppSelector} from '@/common/hooks/redux';

export function Auth() {
  const {navigate} = useNavigation<TNavigation>();
  const {locationPermission, notificationPermission} = useAppSelector(
    state => state.ably,
  );
  const [showSplash, setShowSplash] = useState(true);
  const [swipe, setSwipe] = useState(false);

  const permissions = Boolean(locationPermission && notificationPermission);

  useEffect(() => {
    if (permissions) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [permissions]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Center w={'$full'} h={'$full'} bg={theme.colors.primary.white}>
      <StatusBar
        animated={true}
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      />
      <View h={'$full'} w={'85%'} overflow={'hidden'}>
        <View h={'90%'} w={'$full'}>
          <Pressable onPress={() => setSwipe(!swipe)}>
            {swipe ? <AuthSwipe1 /> : <AuthSwipe2 />}
          </Pressable>
        </View>
        <HStack w={'$full'} justifyContent={'space-between'} gap={'$4'}>
          <Button
            variant={'solid'}
            w={'$full'}
            bg={theme.colors.primary.DEFAULT}
            onPress={() => navigate(ERoutes.LOGIN)}>
            <ButtonText>Skip</ButtonText>
          </Button>
          {/* <Button
            variant={'outline'}
            w={'48%'}
            borderColor={theme.colors.primary.DEFAULT}
            onPress={() => navigate(ERoutes.LOGIN)}>
            <ButtonText color={theme.colors.primary.DEFAULT}>Login</ButtonText>
          </Button> */}
        </HStack>
      </View>
    </Center>
  );
}
