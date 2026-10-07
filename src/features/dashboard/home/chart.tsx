import BadgeLogo from '@/assets/svgs/badge';
import {theme} from '@/providers/theme-provider';
import {HStack, Text, VStack} from '@gluestack-ui/themed';
import React from 'react';

export function Chart({data}: any) {
  return (
    <VStack space={'md'} borderColor={'#F7F7FF'} borderWidth={'$2'} p={'$4'}>
      <HStack justifyContent={'space-between'}>
        <VStack bg={'#F5FFFB'} w={'48%'} h={'$24'} p={'$3'} space={'sm'}>
          <BadgeLogo color={theme.colors.status.success} />
          <Text
            fontFamily={theme.fontFamily.medium}
            fontWeight={'meduim'}
            fontSize={'$md'}
            color={'#333333'}>
            {data?.totalCompleted || 0}
          </Text>
          <Text
            fontFamily={theme.fontFamily.regular}
            fontSize={'$sm'}
            color={'#333333'}>
            Verified
          </Text>
        </VStack>

        <VStack bg={'#FFF5F5'} w={'48%'} h={'$24'} p={'$3'} space={'sm'}>
          <BadgeLogo color={'#CC707B'} />
          <Text
            fontFamily={theme.fontFamily.medium}
            fontWeight={'bold'}
            fontSize={'$md'}
            color={'#333333'}>
            {data?.totalFailed || 0}
          </Text>
          <Text
            fontFamily={theme.fontFamily.regular}
            fontSize={'$sm'}
            color={'#333333'}>
            Failed
          </Text>
        </VStack>
      </HStack>

      <VStack bg={'#F0F9FF'} h={'$24'} p={'$3'} space={'sm'}>
        <BadgeLogo color={theme.colors.status.started} />
        <Text
          fontFamily={theme.fontFamily.medium}
          fontWeight={'meduim'}
          fontSize={'$md'}
          color={'#333333'}>
          {data?.totalInprogress || 0}
        </Text>
        <Text
          fontFamily={theme.fontFamily.regular}
          fontSize={'$sm'}
          color={'#333333'}>
          In Progress
        </Text>
      </VStack>
    </VStack>
  );
}
