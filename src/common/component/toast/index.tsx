import React from 'react';
import {
  View,
  Text,
  HStack,
  Center,
  VStack,
  SafeAreaView,
} from '@gluestack-ui/themed';
import {Motion} from '@legendapp/motion';
import {useCustomToast} from '@/common/hooks/toast';
import {theme} from '@/providers/theme-provider';

const color = {
  default: theme.colors.status.started,
  error: theme.colors.status.error,
  success: theme.colors.status.success,
};

export const ToastProvider: React.FC = () => {
  const {toasts} = useCustomToast();

  return (
    <SafeAreaView>
      {toasts.length ? (
        <VStack
          position={'absolute'}
          top={'$0'}
          zIndex={9999}
          w={'$full'}
          space={'md'}>
          {toasts?.map(item => (
            <Motion.View
              key={item?.id}
              initial={{
                x: 100,
                opacity: 0.5,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: -100,
                opacity: 0.5,
              }}
              transition={{
                default: {
                  type: 'spring',
                  damping: 20,
                  stiffness: 300,
                },
                x: {
                  type: 'spring',
                  damping: 20,
                  stiffness: 1000,
                },
                opacity: {
                  type: 'tween',
                  duration: 1000,
                },
              }}>
              <Center w={'$full'}>
                <HStack
                  bg={'#F5FFFB'}
                  minWidth={'60%'}
                  minHeight={'$12'}
                  borderRadius={'$xl'}
                  space={'sm'}>
                  <View
                    h={'$full'}
                    bg={(color as {[key: string]: string})[item.type]}
                    w={'$2'}
                    borderTopLeftRadius={'$xl'}
                    borderBottomLeftRadius={'$xl'}
                  />
                  <Center py={'$1'} pr={'$5'}>
                    {item?.title && (
                      <Text
                        mb={'$1.5'}
                        color={(color as {[key: string]: string})[item.type]}
                        fontFamily={theme.fontFamily.medium}
                        fontSize={'$md'}
                        textAlign={'left'}
                        w={'$full'}>
                        {item?.title}
                      </Text>
                    )}
                    <Text
                      color={(color as {[key: string]: string})[item.type]}
                      fontFamily={theme.fontFamily.medium}
                      fontSize={'$lg'}
                      textAlign={'left'}
                      w={'$full'}>
                      {item?.description}
                    </Text>
                  </Center>
                </HStack>
              </Center>
            </Motion.View>
          ))}
        </VStack>
      ) : null}
    </SafeAreaView>
  );
};
