import {ERoutes} from '@/common/enum/routes';
import {theme} from '@/providers/theme-provider';
import {
  Center,
  HStack,
  Pressable,
  Switch,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import {Bell} from 'lucide-react-native';
import React from 'react';

const NAVY = '#0B2A5B';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

// Top of the home screen: greeting, notifications, and a large online/offline card
// so agents always know whether they can receive job offers.
export function Header({handleStatus, navigate, status, name}: any) {
  const online = status === 'online';
  const initial = String(name || 'A')
    .charAt(0)
    .toUpperCase();

  return (
    <View
      bg={NAVY}
      pb={'$5'}
      borderBottomLeftRadius={24}
      borderBottomRightRadius={24}>
      <Center w={'$full'}>
        <HStack
          w={'88%'}
          pt={'$4'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <HStack space={'md'} alignItems={'center'}>
            <Center
              w={'$10'}
              h={'$10'}
              borderRadius={'$full'}
              bg={theme.colors.primary.yellow}>
              <Text color={'#FFFFFF'} fontFamily={theme.fontFamily.bold}>
                {initial}
              </Text>
            </Center>
            <VStack>
              <Text color={'#C9D6EA'} fontSize={'$xs'}>
                {greeting()}
              </Text>
              <Text
                color={'#FFFFFF'}
                fontFamily={theme.fontFamily.bold}
                fontSize={'$lg'}>
                {name || 'Agent'}
              </Text>
            </VStack>
          </HStack>
          <Pressable
            bg={'rgba(255,255,255,0.12)'}
            p={'$2'}
            borderRadius={'$full'}
            onPress={() => navigate(ERoutes.NOTIFICATION)}>
            <Bell width={20} height={20} color={'#FFFFFF'} />
          </Pressable>
        </HStack>

        <HStack
          w={'88%'}
          mt={'$4'}
          p={'$4'}
          borderRadius={'$xl'}
          bg={online ? '#E8FBF4' : '#F2F4F7'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <HStack space={'sm'} alignItems={'center'} flex={1}>
            <View
              w={'$3'}
              h={'$3'}
              borderRadius={'$full'}
              bg={online ? theme.colors.status.success : theme.colors.grey[300]}
            />
            <VStack flex={1}>
              <Text
                fontFamily={theme.fontFamily.bold}
                color={online ? '#05624F' : theme.colors.grey.solid}>
                {online ? 'You are online' : 'You are offline'}
              </Text>
              <Text fontSize={'$xs'} color={theme.colors.grey.solid}>
                {online
                  ? 'Keep the app open to receive job offers near you'
                  : 'Turn on to start receiving job offers'}
              </Text>
            </VStack>
          </HStack>
          <Switch
            value={online}
            onValueChange={(e: boolean) => handleStatus(e)}
            sx={{
              props: {
                trackColor: {
                  false: theme.colors.grey[300],
                  true: theme.colors.status.success,
                },
              },
            }}
          />
        </HStack>
      </Center>
    </View>
  );
}
