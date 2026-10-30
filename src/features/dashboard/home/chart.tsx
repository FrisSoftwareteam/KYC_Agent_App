import {theme} from '@/providers/theme-provider';
import {HStack, Text, VStack} from '@gluestack-ui/themed';
import {CheckCircle2, Clock3, XCircle} from 'lucide-react-native';
import React from 'react';

function Stat({icon, value, label, bg, color}: any) {
  return (
    <VStack
      flex={1}
      bg={bg}
      p={'$3'}
      borderRadius={'$xl'}
      space={'xs'}
      alignItems={'flex-start'}>
      {icon}
      <Text fontFamily={theme.fontFamily.bold} fontSize={'$2xl'} color={color}>
        {value || 0}
      </Text>
      <Text fontSize={'$xs'} color={theme.colors.grey.solid}>
        {label}
      </Text>
    </VStack>
  );
}

// The agent's numbers for the chosen period, side by side.
export function Chart({data}: any) {
  return (
    <HStack space={'sm'} mt={'$3'}>
      <Stat
        icon={<Clock3 width={18} height={18} color={'#3B6FE0'} />}
        value={data?.totalInprogress}
        label={'In progress'}
        bg={'#EEF4FF'}
        color={'#1E3A8A'}
      />
      <Stat
        icon={<CheckCircle2 width={18} height={18} color={'#00A884'} />}
        value={data?.totalCompleted}
        label={'Verified'}
        bg={'#E8FBF4'}
        color={'#05624F'}
      />
      <Stat
        icon={<XCircle width={18} height={18} color={'#D0021B'} />}
        value={data?.totalFailed}
        label={'Not verified'}
        bg={'#FFF1F2'}
        color={'#9F1239'}
      />
    </HStack>
  );
}
