import {theme} from '@/providers/theme-provider';
import {
  VStack,
  HStack,
  View,
  Text,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import {ChevronLeft} from 'lucide-react-native';
import React from 'react';

export function StepThree({handleNext, handlePrev}: any) {
  return (
    <View my={'$5'}>
      <Text size="lg" fontWeight={'$bold'} fontFamily={theme.fontFamily.medium}>
        Notifications
      </Text>
      <VStack space={'lg'} mt={'$4'}>
        <Text lineHeight={'$sm'} fontSize={'$sm'} color={'#000000'}>
          You can view all your notifications here.
        </Text>
      </VStack>

      <HStack
        justifyContent={'space-between'}
        alignItems={'center'}
        space="lg"
        w={'$full'}
        mt={'$8'}>
        <View>
          <Text color={theme.colors.grey.solid}>3/3</Text>
        </View>

        <HStack space={'lg'} alignItems={'center'}>
          <Button
            bg={theme.colors.grey[400]}
            variant={'solid'}
            w={'$8'}
            h={'$8'}
            borderRadius={20}
            onPress={handlePrev}>
            <ChevronLeft color={theme.colors.grey.solid} />
          </Button>

          <Button
            bg={theme.colors.primary.DEFAULT}
            variant={'solid'}
            onPress={handleNext}>
            <ButtonText color={theme.colors.primary.white}>Got it!</ButtonText>
          </Button>
        </HStack>
      </HStack>
    </View>
  );
}
