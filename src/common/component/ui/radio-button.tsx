import {theme} from '@/providers/theme-provider';
import {Center, View, Text, Pressable} from '@gluestack-ui/themed';
import React from 'react';
import {PressableProps} from 'react-native';

type TRadioButton = {
  value: string;
  payload: string | undefined;
};

export function RadioButton({
  value,
  payload,
  ...props
}: TRadioButton & PressableProps) {
  const status = Boolean(payload === value);
  return (
    <Pressable
      {...props}
      w={'48%'}
      borderColor={status ? theme.colors.primary.DEFAULT : '#CDD7EB'}
      bg={status ? '#F7F7FF' : 'transparent'}
      borderWidth={'$1'}
      borderRadius={'$lg'}
      px={'$2'}
      h={'$12'}
      alignItems={'center'}
      flexDirection={'row'}
      display={'flex'}
      gap={'$2'}>
      <Center
        borderColor={
          status ? theme.colors.primary.DEFAULT : theme.colors.grey[300]
        }
        borderWidth={'$2'}
        borderRadius={'$full'}
        w={'$6'}
        h={'$6'}
        p={'$0.5'}>
        {status && (
          <View
            bg={theme.colors.primary.DEFAULT}
            h={'$full'}
            w={'$full'}
            borderRadius={'$full'}
          />
        )}
      </Center>
      <Text
        fontSize={'$lg'}
        fontFamily={theme.fontFamily.medium}
        color={theme.colors.grey.solid}>
        {value}
      </Text>
    </Pressable>
  );
}
