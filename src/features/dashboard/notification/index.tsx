import React from 'react';
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
import data from '@/providers/data-provider/notification.json';
import img from '@/assets/images/notification/img-1.png';

export function Notification() {
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
                      You have no notifications at the moment
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
