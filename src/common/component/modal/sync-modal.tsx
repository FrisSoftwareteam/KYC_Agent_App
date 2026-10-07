import {useAppSelector} from '@/common/hooks/redux';
import {theme} from '@/providers/theme-provider';
import {
  Text,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  Center,
  View,
  Spinner,
} from '@gluestack-ui/themed';
import React from 'react';

export function SyncModal() {
  const {isSyncing} = useAppSelector(state => state.offline);

  return (
    <AlertDialog isOpen={isSyncing} closeOnOverlayClick={false}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <View w={'$full'} pt={'$5'} position={'relative'}>
            <Text
              size="lg"
              fontWeight={'$bold'}
              textAlign={'center'}
              fontFamily={theme.fontFamily.medium}>
              Syncing offline verification!!!
            </Text>
          </View>
        </AlertDialogHeader>
        <AlertDialogBody mb={'$5'}>
          <Center>
            <Text
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey[200]}
              fontSize={'$lg'}>
              Your offline verification data is currently syncing, please
              wait...
            </Text>
            <Spinner
              size={'large'}
              color={theme.colors.primary.DEFAULT}
              mt={'$3'}
            />
          </Center>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
}
