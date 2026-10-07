import {theme} from '@/providers/theme-provider';
import {View} from '@gluestack-ui/themed';
import React from 'react';

export const Separator = () => (
  <View borderBottomWidth="$1" borderColor={theme.colors.grey[500]} py="$4" />
);
