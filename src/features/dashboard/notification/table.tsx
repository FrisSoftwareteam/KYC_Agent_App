import NotificationLogo from '@/assets/svgs/notifcation';
import {theme} from '@/providers/theme-provider';
import {HStack, Text, VStack, View} from '@gluestack-ui/themed';
import React from 'react';

export function Table({data}: any) {
  return (
    <HStack
      space={'md'}
      borderColor={theme.colors.grey[500]}
      // borderWidth={'$1'}
      p={'$4'}
      key={data._id}>
      <View mt={'$1'}>
        <NotificationLogo />
      </View>
      <VStack space={'xs'}>
        <Text
          fontFamily={theme.fontFamily.medium}
          fontSize={'$sm'}
          fontWeight={'$medium'}
          color={'#333333'}>
          {data.title}
        </Text>
        <Text
          fontFamily={theme.fontFamily.regular}
          fontSize={'$sm'}
          fontWeight={'$normal'}
          color={theme.colors.grey.solid}>
          {data.message}
        </Text>
      </VStack>
    </HStack>
  );
}
