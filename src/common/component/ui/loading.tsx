import {theme} from '@/providers/theme-provider';
import {Center, Spinner} from '@gluestack-ui/themed';
import React, {Fragment} from 'react';

export function ApiLoading({isLoading}: any) {
  return (
    <Fragment>
      {isLoading ? (
        <Center position={'absolute'} top={'$5'} w={'$full'} zIndex={5}>
          <Spinner size={'large'} color={theme.colors.primary.DEFAULT} />
        </Center>
      ) : null}
    </Fragment>
  );
}
