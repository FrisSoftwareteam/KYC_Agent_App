import {theme} from '@/providers/theme-provider';
import {HStack, Text, VStack, View} from '@gluestack-ui/themed';
import React from 'react';
import {formatDate} from '@/utils/date-format';
import {Status} from '@/common/component/status';
import {TouchableOpacity} from 'react-native';
import {ChevronRight, MapPin} from 'lucide-react-native';

type TVerification = {
  data: any;
  handclick: any;
};

// One job in a list: a tappable card with the candidate, address, date and status.
export function VerificationTable({data, handclick}: TVerification) {
  const name = [data?.candidate?.firstName, data?.candidate?.lastName]
    .filter(Boolean)
    .join(' ');
  const initials = name
    .split(' ')
    .map((p: string) => p.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View mt={'$3'}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handclick(data?._id)}>
        <HStack
          w={'$full'}
          p={'$3'}
          borderRadius={'$xl'}
          borderWidth={'$1'}
          borderColor={'#E6EAF2'}
          bg={'#FFFFFF'}
          space={'md'}
          alignItems={'center'}>
          <View
            w={'$10'}
            h={'$10'}
            borderRadius={'$full'}
            bg={'#EEF2F8'}
            alignItems={'center'}
            justifyContent={'center'}>
            <Text color={'#0B2A5B'} fontFamily={theme.fontFamily.bold}>
              {initials || '?'}
            </Text>
          </View>
          <VStack flex={1} space={'xs'}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <Text
                flex={1}
                color={'#1F2937'}
                fontSize={'$md'}
                fontFamily={theme.fontFamily.bold}
                isTruncated>
                {name || 'Candidate'}
              </Text>
              <Status status={data?.status} />
            </HStack>
            <HStack space={'xs'} alignItems={'center'}>
              <MapPin width={13} height={13} color={theme.colors.grey[200]} />
              <Text
                flex={1}
                fontSize={'$sm'}
                color={theme.colors.grey.solid}
                fontFamily={theme.fontFamily.regular}
                isTruncated>
                {data?.formatAddress || 'Address not given'}
              </Text>
            </HStack>
            <Text
              fontSize={'$xs'}
              color={theme.colors.grey[200]}
              fontFamily={theme.fontFamily.regular}>
              {formatDate(data?.createdAt)}
              {data?.category ? `  ·  ${data.category}` : ''}
            </Text>
          </VStack>
          <ChevronRight width={18} height={18} color={theme.colors.grey[300]} />
        </HStack>
      </TouchableOpacity>
    </View>
  );
}
