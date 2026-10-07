import {ERoutes} from '@/common/enum/routes';
import {TNavigation} from '@/common/types/navigation';
import {theme} from '@/providers/theme-provider';
import {Center, HStack, Text, View} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {X} from 'lucide-react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';

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
          color={theme.colors.grey.solid}
          fontFamily={theme.fontFamily.bold}
          fontWeight={'$medium'}
          fontSize={'$md'}>
          Notifications
        </Text>

        <View position={'absolute'} left={0} zIndex={2}>
          <TouchableOpacity
            onPress={() => navigate(ERoutes.HOME, {screen: ERoutes.DASHBOARD})}>
            <X width={20} height={20} color={theme.colors.grey.solid} />
          </TouchableOpacity>
        </View>
      </HStack>
    </Center>
  );
}
