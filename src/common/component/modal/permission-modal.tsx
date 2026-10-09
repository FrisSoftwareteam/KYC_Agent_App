import {useAppSelector} from '@/common/hooks/redux';
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
  Divider,
  View,
  Center,
} from '@gluestack-ui/themed';
import React, {Fragment} from 'react';
import {BackHandler, Linking} from 'react-native';

export function PermissionModal() {
  const {permissionIsOpen} = useAppSelector(state => state.ably);

  return (
    <Fragment>
      <AlertDialog isOpen={permissionIsOpen} closeOnOverlayClick={false}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <View w={'$full'} pt={'$5'} position={'relative'}>
              <Text
                size="lg"
                fontWeight={'$bold'}
                textAlign={'center'}
                fontFamily={theme.fontFamily.medium}>
                {'Permission not granted'}
              </Text>
            </View>
          </AlertDialogHeader>
          <AlertDialogBody mb={'$5'}>
            <Center>
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey[200]}
                fontSize={'$lg'}>
                CléCheck Agent needs your location (to confirm visits) and
                notifications (to receive new jobs). Tap Open Settings, allow
                both, then come back to the app.
              </Text>
            </Center>
          </AlertDialogBody>
          <Divider my={'$4'} />
          <AlertDialogFooter mb={'$8'}>
            <ButtonGroup space="lg">
              <Button
                variant={'outline'}
                w={'46%'}
                borderColor={theme.colors.primary.DEFAULT}
                onPress={() => BackHandler.exitApp()}>
                <ButtonText
                  fontFamily={theme.fontFamily.regular}
                  color={theme.colors.primary.DEFAULT}>
                  Close app
                </ButtonText>
              </Button>

              <Button
                bg={theme.colors.primary.DEFAULT}
                size={'lg'}
                variant={'solid'}
                w={'46%'}
                onPress={() => Linking.openSettings()}>
                <ButtonText fontFamily={theme.fontFamily.regular}>
                  Open Settings
                </ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}
