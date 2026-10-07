import {theme} from '@/providers/theme-provider';
import {Text, View} from '@gluestack-ui/themed';
import React, {useMemo} from 'react';

export function Status({status}: {status: string}) {
  const ui = useMemo(() => {
    if (
      [
        'success',
        'verified',
        'active',
        'completed',
        'accepted',
        'complete',
        'approved',
      ].includes(status?.toLowerCase())
    ) {
      return {
        bg: '#F5FFFB',
        color: theme.colors.status.success,
      };
    } else if (
      [
        'inactive',
        'declined',
        'failed',
        'unverified',
        'unapproved',
        'denied',
      ].includes(status?.toLowerCase())
    ) {
      return {
        bg: '#FFF5F5',
        color: '#CC707B',
      };
    } else if (
      ['pending', 'initial', 'inprogress', 'started'].includes(
        status?.toLowerCase(),
      )
    ) {
      return {
        bg: '#F0F9FF',
        color: theme.colors.status.started,
      };
    }
  }, [status]);

  return (
    <View h={'auto'}>
      <Text
        color={ui?.color}
        py={'$1'}
        px={'$3'}
        bg={ui?.bg}
        height={'auto'}
        fontFamily={theme.fontFamily.regular}
        textTransform={'capitalize'}>
        {status.toLowerCase() === 'inprogress' ? 'in progress' : status}
      </Text>
    </View>
  );
}
