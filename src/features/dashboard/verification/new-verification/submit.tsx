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
} from '@gluestack-ui/themed';
import {X} from 'lucide-react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';

export function Submit({isOpen, onClose, handleSubmit}: any) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} zIndex={999}>
      <ActionsheetBackdrop />
      <ActionsheetContent h="$80" zIndex={999}>
        <View w={'$full'} h={'auto'}>
          <Center w={'$full'} h={'auto'}>
            <Center
              h={'auto'}
              w={'85%'}
              overflow={'hidden'}
              position={'relative'}>
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey.solid}
                fontSize={'$lg'}
                mt={'$9'}>
                Submit verification
              </Text>
              <Text
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey.solid}
                fontSize={'$md'}
                mt={'$7'}>
                How would you like to submit this verification?
              </Text>
              <View
                position={'absolute'}
                right={0}
                top={'$2'}
                zIndex={2}
                bg={theme.colors.primary.white}
                borderRadius={'$full'}
                p={'$1'}>
                <TouchableOpacity onPress={onClose}>
                  <X width={20} height={20} color={theme.colors.grey.solid} />
                </TouchableOpacity>
              </View>
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
              <VStack space={'2xl'} h={'auto'} w={'85%'} pt={'$5'}>
                <Button
                  bg={theme.colors.primary.DEFAULT}
                  h={'$12'}
                  onPress={() => {
                    handleSubmit('verified');
                    onClose();
                  }}>
                  <ButtonText>Verified</ButtonText>
                </Button>
                <Button
                  bg={theme.colors.primary.white}
                  borderColor={theme.colors.status.error}
                  borderWidth={'$1'}
                  h={'$12'}
                  onPress={() => {
                    handleSubmit('failed');
                    onClose();
                  }}>
                  <ButtonText color={theme.colors.status.error}>
                    Not Verified
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
