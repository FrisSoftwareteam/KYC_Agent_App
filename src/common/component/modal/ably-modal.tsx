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
import {formatDistance} from '@/utils/distance';
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
              New job offer
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
              <Text color={theme.colors.grey.solid}>
                {typeof data?.address === 'string'
                  ? data?.address
                  : (data?.address as any)?.formatAddress}
              </Text>
            </Text>
            {Boolean(data?.landmark) && (
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey[200]}
                fontSize={'$md'}>
                Landmark:{' '}
                <Text color={theme.colors.grey.solid}>{data?.landmark}</Text>
              </Text>
            )}
            {Boolean(formatDistance(data?.distance)) && (
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey[200]}
                fontSize={'$md'}>
                Distance:{' '}
                <Text color={theme.colors.grey.solid}>
                  {formatDistance(data?.distance)} away
                </Text>
              </Text>
            )}
            {Number(data?.price) > 0 && (
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey[200]}
                fontSize={'$md'}>
                You earn:{' '}
                <Text color={theme.colors.grey.solid}>
                  ₦{Number(data?.price).toLocaleString()}
                </Text>
              </Text>
            )}
            {Boolean(data?.turnarroundTime) && (
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey[200]}
                fontSize={'$md'}>
                Complete within:{' '}
                <Text color={theme.colors.grey.solid}>
                  {data?.turnarroundTime}
                </Text>
              </Text>
            )}
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
