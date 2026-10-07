import React from 'react';
import {LinearGradient} from '@gluestack-ui/themed';
import {LinearGradient as RNLinearGradient} from 'react-native-linear-gradient';

export const CustomLinear = (props: any) => {
  return <LinearGradient as={RNLinearGradient} {...props} />;
};
