import {useAbly} from '@/lib/ably/ably';
import {theme} from '@/providers/theme-provider';
import {
  Text,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonGroup,
  ButtonText,
  VStack,
  Divider,
  View,
} from '@gluestack-ui/themed';
import React from 'react';

export function AblyModal() {
  const {isOpen, isLoading, handleClose, data, handleSubmit} = useAbly();

  return (
    <AlertDialog isOpen={isOpen} closeOnOverlayClick={false}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <View w={'$full'} pt={'$5'} position={'relative'}>
            <Text
              size="lg"
              fontWeight={'$bold'}
              textAlign={'center'}
              fontFamily={theme.fontFamily.medium}>
              New verification?
            </Text>
            {/* <Center
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
            </Center> */}
          </View>
        </AlertDialogHeader>
        <AlertDialogBody>
          <VStack>
            <Text
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey[200]}
              fontSize={'$md'}>
              Name:{' '}
              <Text color={theme.colors.grey.solid}>
                {`${data?.candidate?.firstName} ${data?.candidate?.lastName}`}
              </Text>
            </Text>
            <Text
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey[200]}
              fontSize={'$md'}>
              Address:{' '}
              <Text color={theme.colors.grey.solid}>{data?.address}</Text>
            </Text>
            <Text
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey[200]}
              fontSize={'$md'}
              isTruncated={true}>
              Distance:{' '}
              <Text color={theme.colors.grey.solid}>
                {data?.distance || 0}m away
              </Text>
            </Text>
          </VStack>
        </AlertDialogBody>
        <Divider my={'$4'} />
        <AlertDialogFooter mb={'$8'}>
          <ButtonGroup space="lg">
            <Button
              variant={'outline'}
              w={'46%'}
              borderColor={theme.colors.primary.DEFAULT}
              onPress={handleClose}
              isDisabled={isLoading}>
              <ButtonText
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.primary.DEFAULT}>
                Decline
              </ButtonText>
            </Button>

            <Button
              bg={theme.colors.primary.DEFAULT}
              size={'lg'}
              variant={'solid'}
              w={'46%'}
              onPress={handleSubmit}
              isDisabled={isLoading}>
              <ButtonText fontFamily={theme.fontFamily.regular}>
                Accept
              </ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
