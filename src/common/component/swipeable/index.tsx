import React from 'react';
import {theme} from '@/providers/theme-provider';
import {Center, HStack, View, Image, Text} from '@gluestack-ui/themed';
import {CustomLinear} from '../ui/linear-gradient';
import img2 from '@/assets/images/auth/auth-1.png';
import img1 from '@/assets/images/auth/auth-3.png';
import {Easing} from 'react-native';
import {Motion} from '@legendapp/motion';

export function AuthSwipe1() {
  return (
    <Motion.View
      initial={{opacity: 0}}
      animate={{
        opacity: 1,
      }}
      transition={{
        type: 'timing',
        duration: 1000,
        easing: Easing.in(Easing.ease),
      }}>
      <Center mt={'20%'} w={'$full'}>
        <View h={320} w={320}>
          <Image
            source={img1}
            alt="image"
            objectFit={'cover'}
            w={'$full'}
            h={'$full'}
          />
        </View>
        <HStack space={'md'} py={'$4'}>
          <CustomLinear
            h={'$1'}
            w={'$8'}
            borderRadius={'$2xl'}
            colors={['#CCA047', '#11406F']}
            start={{x: 0, y: 0} as any}
            end={{x: 1, y: 1} as any}
          />
          <View
            h={'$1'}
            w={'$8'}
            borderRadius={'$2xl'}
            bg={theme.colors.grey[300]}
          />
        </HStack>
        <Text
          size={'2xl'}
          fontWeight={'medium'}
          color={theme.colors.primary.DEFAULT}
          fontFamily={theme.fontFamily.bold}>
          Location tracker
        </Text>
        <Text
          size={'sm'}
          fontWeight={'normal'}
          color={theme.colors.grey.solid}
          fontFamily={theme.fontFamily.medium}
          textAlign={'center'}>
          Easily locate the addresses of verifications assigned to you.
        </Text>
      </Center>
    </Motion.View>
  );
}

export function AuthSwipe2() {
  return (
    <Motion.View
      initial={{opacity: 0}}
      animate={{
        opacity: 1,
      }}
      transition={{
        type: 'timing',
        duration: 1000,
        easing: Easing.in(Easing.ease),
      }}>
      <Center mt={'20%'} w={'$full'}>
        <View h={320} w={320}>
          <Image
            source={img2}
            alt="image"
            objectFit={'cover'}
            w={'$full'}
            h={'$full'}
          />
        </View>
        <HStack space={'md'} py={'$4'}>
          <View
            h={'$1'}
            w={'$8'}
            borderRadius={'$2xl'}
            bg={theme.colors.grey[300]}
          />
          <CustomLinear
            h={'$1'}
            w={'$8'}
            borderRadius={'$2xl'}
            colors={['#CCA047', '#11406F']}
            start={{x: 0, y: 0} as any}
            end={{x: 1, y: 1} as any}
          />
        </HStack>
        <Text
          size={'2xl'}
          fontWeight={'medium'}
          color={theme.colors.primary.DEFAULT}
          fontFamily={theme.fontFamily.bold}>
          Verification manager
        </Text>
        <Text
          size={'sm'}
          fontWeight={'normal'}
          color={theme.colors.grey.solid}
          fontFamily={theme.fontFamily.medium}
          textAlign={'center'}>
          Effortlessly manage all verifications assigned to you.
        </Text>
      </Center>
    </Motion.View>
  );
}
