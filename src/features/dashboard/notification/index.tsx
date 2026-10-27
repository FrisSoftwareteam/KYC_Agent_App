import React, {useMemo} from 'react';
import {theme} from '@/providers/theme-provider';
import {
  Center,
  View,
  StatusBar,
  SafeAreaView,
  Text,
  SectionList,
  Image,
  VStack,
} from '@gluestack-ui/themed';
import {Header} from './header';
import {Table} from './table';
import {notificationDateFormat} from '@/utils/date-format';
import {useVerificationQuery} from '@/apis/verification';
import {useNetInfo} from '@react-native-community/netinfo';

const STATUS_TEXT: Record<string, string> = {
  accepted: 'Job accepted, not started yet',
  inprogress: 'Visit in progress',
  verified: 'Submitted as verified',
  failed: 'Submitted as not verified',
  flagged: 'Marked for review',
  rejected: 'Rejected by the reviewer',
};

const activityDate = (item: any) =>
  item?.timelines?.completedAt ||
  item?.timelines?.acceptedAt ||
  item?.createdAt;

// Recent activity on the agent's own jobs, grouped by day (newest first).
// This replaces the sample notifications the screen used to show.
const useActivity = () => {
  const {isInternetReachable} = useNetInfo();
  const {data} = useVerificationQuery('?size=30', {skip: !isInternetReachable});
  return useMemo(() => {
    const items = [...(data?.data?.addresses || [])].sort(
      (a: any, b: any) =>
        new Date(activityDate(b)).getTime() -
        new Date(activityDate(a)).getTime(),
    );
    const groups: Record<string, any> = {};
    items.forEach((item: any) => {
      const when = new Date(activityDate(item));
      const key = when.toDateString();
      if (!groups[key]) {
        groups[key] = {_id: key, date: when, data: []};
      }
      groups[key].data.push({
        _id: item._id,
        title: STATUS_TEXT[item.status] || 'Job updated',
        message: `${item?.candidate?.firstName || ''} ${
          item?.candidate?.lastName || ''
        } · ${item?.formatAddress || ''}`.trim(),
      });
    });
    return Object.values(groups);
  }, [data]);
};
import img from '@/assets/images/notification/img-1.png';

export function Notification() {
  const data = useActivity();
  return (
    <View w={'$full'} h={'$full'} bg={theme.colors.primary.white}>
      <StatusBar
        animated={true}
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      />
      <SafeAreaView>
        <Header />
        <Center w={'$full'} h={'auto'}>
          <View h={'auto'} w={'85%'} overflow={'hidden'} mt={'$4'}>
            <SectionList
              ListEmptyComponent={
                <VStack
                  w={'$full'}
                  alignItems={'center'}
                  mt={'$32'}
                  space={'xl'}>
                  <Center w={'$full'}>
                    <Image source={img} alt="Image one" w={'$40'} h={'$32'} />
                  </Center>
                  <Center>
                    <Text
                      fontFamily={theme.fontFamily.bold}
                      color={theme.colors.grey.solid}
                      fontWeight={'$medium'}
                      fontSize={'$lg'}>
                      No notifications
                    </Text>
                    <Text
                      fontFamily={theme.fontFamily.regular}
                      fontWeight={'$medium'}
                      fontSize={'$sm'}
                      color={theme.colors.grey[200]}
                      mt={'$3'}>
                      Updates on your jobs will appear here
                    </Text>
                  </Center>
                </VStack>
              }
              ListFooterComponent={<View h={'$32'} />}
              sections={data}
              renderItem={({item}) => <Table data={item} />}
              renderSectionHeader={({section: {date}}: any) => (
                <Text
                  color={theme.colors.grey.solid}
                  fontFamily={theme.fontFamily.regular}
                  fontWeight={'$semibold'}
                  fontSize={'$sm'}
                  textTransform={'capitalize'}
                  my={'$5'}>
                  {notificationDateFormat(date)}
                </Text>
              )}
              keyExtractor={(item: any) => item?._id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Center>
      </SafeAreaView>
    </View>
  );
}
