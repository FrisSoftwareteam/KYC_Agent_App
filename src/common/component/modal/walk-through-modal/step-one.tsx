import {theme} from '@/providers/theme-provider';
import {VStack, HStack, View, Text, Button} from '@gluestack-ui/themed';
import {ChevronLeft, ChevronRight} from 'lucide-react-native';
import React from 'react';

export function StepOne({handleNext, handlePrev}: any) {
  return (
    <View my={'$5'}>
      <Text size="lg" fontWeight={'$bold'} fontFamily={theme.fontFamily.medium}>
        Welcome to your dashboard
      </Text>
      <VStack space={'lg'} mt={'$4'}>
        <HStack alignItems={'center'} space={'xs'}>
          <View
            h={'$1.5'}
            w={'$1.5'}
            bg={theme.colors.grey.solid}
            borderRadius={'$full'}
          />
          <Text lineHeight={'$sm'} fontSize={'$sm'} color={'#000000'}>
            Here, you can view your verification metrics using the date filter.
          </Text>
        </HStack>
        <HStack alignItems={'center'} space={'xs'}>
          <View
            h={'$1.5'}
            w={'$1.5'}
            bg={theme.colors.grey.solid}
            borderRadius={'$full'}
          />
          <Text lineHeight={'$sm'} fontSize={'$sm'} color={'#000000'}>
            You get new verification alerts here.
          </Text>
        </HStack>
        <HStack alignItems={'center'} space={'xs'}>
          <View
            h={'$1.5'}
            w={'$1.5'}
            bg={theme.colors.grey.solid}
            borderRadius={'$full'}
          />
          <Text lineHeight={'$sm'} fontSize={'$sm'} color={'#000000'}>
            You can also view your recent verifications.
          </Text>
        </HStack>
      </VStack>

      <HStack
        justifyContent={'space-between'}
        alignItems={'center'}
        space="lg"
        w={'$full'}
        mt={'$8'}>
        <View>
          <Text color={theme.colors.grey.solid}>1/3</Text>
        </View>

        <HStack space={'lg'}>
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
            w={'$8'}
            h={'$8'}
            borderRadius={50}
            onPress={handleNext}>
            <ChevronRight color={theme.colors.primary.white} />
          </Button>
        </HStack>
      </HStack>
    </View>
  );
}
