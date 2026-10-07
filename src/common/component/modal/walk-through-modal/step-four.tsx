import {useAppDispatch, useAppSelector} from '@/common/hooks/redux';
import {setWalkThrough} from '@/features/auth/slice';
import {theme} from '@/providers/theme-provider';
import {
  Button,
  ButtonText,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  Center,
  View,
  VStack,
  Text,
  Image,
} from '@gluestack-ui/themed';
import React from 'react';
import youtubeImg from '@/assets/images/walk-through/youtube.png';
import {setToast} from '../../toast/slice';

export function StepFour() {
  const dispatch = useAppDispatch();
  const {walkThroughSteps} = useAppSelector(state => state.auth);

  const onClose = () => {
    dispatch(setWalkThrough({steps: walkThroughSteps + 1, start: false}));
    dispatch(
      setToast({
        description: 'The video will be available on your profile.',
        type: 'success',
      }),
    );
  };

  const isOpen = Boolean(walkThroughSteps === 4);

  return (
    <Actionsheet
      isOpen={isOpen}
      onClose={onClose}
      zIndex={999}
      closeOnOverlayClick={false}>
      <ActionsheetBackdrop />
      <ActionsheetContent zIndex={999}>
        <View w={'$full'} h={400}>
          <Center w={'$full'} h={'auto'}>
            <Center h={'auto'} w={'85%'}>
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey.solid}
                fontSize={'$lg'}
                mt={'$9'}>
                A guide on how to verify an address
              </Text>
              <Image
                source={youtubeImg}
                alt="youtube image"
                h={'$80'}
                w={'$full'}
                mt={'$5'}
              />
            </Center>
          </Center>
        </View>
        <View w={'$full'} mt={'$4'}>
          <Center w={'$full'} h={'auto'}>
            <Center
              mt={'$5'}
              mb={'$10'}
              borderColor={theme.colors.grey[500]}
              borderTopWidth={'$1'}
              w={'$full'}>
              <VStack space={'3xl'} h={'auto'} w={'85%'} pt={'$5'}>
                <Button
                  bg={theme.colors.primary.DEFAULT}
                  h={'$12'}
                  onPress={onClose}>
                  <ButtonText>Play now</ButtonText>
                </Button>
                <Button
                  bg={theme.colors.primary.white}
                  borderColor={theme.colors.grey.solid}
                  borderWidth={'$1'}
                  h={'$12'}
                  onPress={onClose}>
                  <ButtonText color={theme.colors.grey.solid}>
                    Watch later
                  </ButtonText>
                </Button>
              </VStack>
            </Center>
          </Center>
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
}
