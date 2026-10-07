import {View} from '@gluestack-ui/themed';
import React, {PropsWithChildren} from 'react';
import {Motion} from '@legendapp/motion';
import {theme} from '@/providers/theme-provider';
import {DimensionValue} from 'react-native';

type TSkeleton = {
  isLoading: boolean;
  width?: DimensionValue;
  height: DimensionValue;
  color?: string;
};

export function Skeleton({
  children,
  isLoading,
  width = '100%',
  height = 20,
  color = theme.colors.grey[200],
}: TSkeleton & PropsWithChildren) {
  return (
    <>
      {isLoading ? (
        <View bg="red" w={'$full'} h={'$full'}>
          <Motion.View
            animate={{
              x: ['100%', '-100%'],
              opacity: [0.2, 1, 0.2],
              ease: 'easeIn',
              duration: 1.5,
              backgroundColor: color,
              height: height,
              width: width,
              //   repeat: Infinity,
            }}
          />
        </View>
      ) : (
        children
      )}
    </>
  );
}
