import {theme} from '@/providers/theme-provider';
import {Avatar, HStack, Text, VStack, View} from '@gluestack-ui/themed';
import React from 'react';
import {formatDate} from '@/utils/date-format';
import AvatarLogo from '@/assets/svgs/avatar';
import {Status} from '@/common/component/status';
import {TouchableOpacity} from 'react-native';

type TVerification = {
  data: any;
  handclick: any;
};

export function VerificationTable({data, handclick}: TVerification) {
  return (
    <View mt={'$9'} flex={1}>
      <TouchableOpacity onPress={() => handclick(data?._id)}>
        <HStack w={'$full'}>
          <HStack space={'md'} w={'$4/6'}>
            <Avatar size="sm" bg={theme.colors.grey[500]}>
              <AvatarLogo />
            </Avatar>
            <VStack w={'$full'} space={'xs'}>
              <Text
                color={'#333333'}
                fontWeight={'medium'}
                fontSize={'$sm'}
                fontFamily={theme.fontFamily.bold}
                isTruncated>
                {`${data?.candidate?.firstName || 'N/A'} ${
                  data?.candidate?.lastName || 'N/A'
                }`}
              </Text>
              <Text
                color={theme.colors.grey[200]}
                fontFamily={theme.fontFamily.regular}>
                {data?.category || 'N/A'}
              </Text>
              <Text
                w={'80%'}
                color={theme.colors.grey.solid}
                fontFamily={theme.fontFamily.regular}
                isTruncated>
                {data?.formatAddress || 'N/A'}
              </Text>
              <Text
                color={theme.colors.grey[200]}
                fontFamily={theme.fontFamily.regular}>
                {formatDate(data?.createdAt)}
              </Text>
            </VStack>
          </HStack>

          <HStack w={'$2/6'} justifyContent={'flex-end'}>
            <Status status={data?.status} />
          </HStack>
        </HStack>
      </TouchableOpacity>
    </View>
  );
}
