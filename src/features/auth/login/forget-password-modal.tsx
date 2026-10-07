import {theme} from '@/providers/theme-provider';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  Icon,
  CloseIcon,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonText,
  Text,
  Button,
  View,
  Center,
  Divider,
} from '@gluestack-ui/themed';
import React from 'react';

export function ForgetPasswordModal({isOpen, onClose}: any) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <View w={'$full'} px={'$3'} pt={'$5'} position={'relative'}>
            <Text
              size="lg"
              fontWeight={'$bold'}
              textAlign={'center'}
              fontFamily={theme.fontFamily.medium}>
              Forgot password?
            </Text>
            <Center
              position={'absolute'}
              right={'$2'}
              top={'$0'}
              h={'$6'}
              w={'$6'}
              bg={theme.colors.grey[400]}
              borderRadius={'$full'}
              zIndex={2}>
              <AlertDialogCloseButton>
                <Icon as={CloseIcon} />
              </AlertDialogCloseButton>
            </Center>
          </View>
        </AlertDialogHeader>
        <AlertDialogBody>
          <View px={'$3'}>
            <Text
              size={'sm'}
              fontFamily={theme.fontFamily.regular}
              lineHeight={'$md'}>
              Kindly reach out to your admin to help with changing your
              password.
            </Text>
          </View>
        </AlertDialogBody>
        <Divider my={'$4'} />
        <AlertDialogFooter mb={'$8'}>
          <Button
            bg={theme.colors.primary.DEFAULT}
            action="negative"
            w={'$full'}
            onPress={onClose}>
            <ButtonText fontFamily={theme.fontFamily.regular}>Okay</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
