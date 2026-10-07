// import BellLogo from '@/assets/svgs/bell';
import {ERoutes} from '@/common/enum/routes';
import {theme} from '@/providers/theme-provider';
import {Center, HStack, Pressable, Switch, Text} from '@gluestack-ui/themed';
import {Bell} from 'lucide-react-native';
import React from 'react';

export function Header({handleStatus, navigate, status, name}: any) {
  return (
    <Center
      h={'$12'}
      w={'$full'}
      shadowColor={theme.colors.primary.white}
      shadowOffset={{width: 0, height: 8}}
      borderBottomColor={theme.colors.grey[500]}
      borderBottomWidth={'$4'}>
      <HStack
        h={'auto'}
        w={'85%'}
        overflow={'hidden'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <HStack space="xs" alignItems={'center'}>
          <Switch
            defaultValue={true}
            onValueChange={e => handleStatus(e)}
            value={status === 'online' ? true : false}
            sx={{
              props: {
                trackColor: {
                  false: theme.colors.grey[300],
                  true: theme.colors.status.success,
                },
              },
            }}
          />
          <Text size="sm">{status}</Text>
        </HStack>
        <Text
          color={theme.colors.grey.solid}
          fontFamily={theme.fontFamily.bold}
          fontWeight={'$medium'}
          fontSize={'$md'}>
          Hi, {name || 'agent'}!
        </Text>

        <Pressable
          bg={'#F7F7FF'}
          p={'$1.5'}
          borderRadius={'$full'}
          onPress={() => navigate(ERoutes.NOTIFICATION)}>
          {/* <BellLogo /> */}
          <Bell width={20} height={20} color={theme.colors.grey.solid} />
        </Pressable>
      </HStack>
    </Center>
  );
}
