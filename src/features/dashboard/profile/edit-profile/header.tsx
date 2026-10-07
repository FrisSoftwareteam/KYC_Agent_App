import {ERoutes} from '@/common/enum/routes';
import {TNavigation} from '@/common/types/navigation';
import {theme} from '@/providers/theme-provider';
import {Center, HStack, Text, Pressable} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {MoveLeft} from 'lucide-react-native';
import React from 'react';

export function Header() {
  const {navigate} = useNavigation<TNavigation>();
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
        justifyContent={'center'}
        position={'relative'}>
        <Text
          color={theme.colors.primary.DEFAULT}
          fontFamily={theme.fontFamily.bold}
          fontWeight={'$medium'}
          fontSize={'$md'}>
          Edit Profile
        </Text>

        <Pressable
          position={'absolute'}
          left={0}
          zIndex={2}
          onPress={() =>
            navigate(ERoutes.PROFILE, {screen: ERoutes.DASHBOARD})
          }>
          <MoveLeft width={20} height={20} color={theme.colors.grey.solid} />
        </Pressable>
      </HStack>
    </Center>
  );
}
