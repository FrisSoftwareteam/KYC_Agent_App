import {
  Center,
  ChevronDownIcon,
  FlatList,
  HStack,
  Icon,
  RefreshControl,
  SafeAreaView,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  StatusBar,
  Text,
  View,
} from '@gluestack-ui/themed';
import React from 'react';
import {Header} from './header';
import {theme} from '@/providers/theme-provider';
import {Chart} from './chart';
import {Separator} from '@/common/component/ui/separator';
import {VerificationTable} from '@/common/component/table';
import {useHome} from '@/common/hooks/home';
import {dateData} from './data';

export function Home() {
  const {
    filter,
    setFilter,
    handleClick,
    handleStatus,
    onRefresh,
    navigate,
    metricsData,
    trendingData,
    status,
    refreshing,
    profileData,
    // isLoading,
  } = useHome();

  return (
    <View w={'$full'} h={'$full'} bg={theme.colors.primary.white}>
      <StatusBar
        animated={true}
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      />
      {/* <ApiLoading isLoading={isLoading} /> */}
      <SafeAreaView>
        <Header
          handleStatus={handleStatus}
          navigate={navigate}
          status={status}
          name={profileData?.user?.firstName}
        />
        <Center w={'$full'} h={'auto'}>
          <View h={'auto'} w={'85%'} overflow={'hidden'} mt={'$4'}>
            <FlatList
              ListHeaderComponent={
                <View>
                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    w={'$full'}>
                    <Text
                      fontFamily={theme.fontFamily.medium}
                      fontSize={'$sm'}
                      color={theme.colors.primary.DEFAULT}>
                      VERIFICATIONS
                    </Text>
                    <Select w={99} onValueChange={e => setFilter(e)}>
                      <SelectTrigger size={'xl'} borderWidth={'$0'}>
                        <SelectInput
                          color={theme.colors.grey.solid}
                          fontSize={'$sm'}
                          fontFamily={theme.fontFamily.regular}
                          placeholder="Today"
                          defaultValue={filter}
                          w={'$full'}
                          textAlign="right"
                        />
                        <View mt={'$2'}>
                          <SelectIcon>
                            <Icon as={ChevronDownIcon} />
                          </SelectIcon>
                        </View>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {dateData.map(item => (
                            <SelectItem
                              label={item.name}
                              value={item.value}
                              key={item.id}
                            />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  </HStack>

                  <Chart data={metricsData?.data} />

                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    w={'$full'}
                    mt={'$10'}>
                    <Text
                      fontFamily={theme.fontFamily.medium}
                      fontSize={'$sm'}
                      color={theme.colors.primary.DEFAULT}>
                      RECENT VERIFICATIONS
                    </Text>
                    <Text
                      fontFamily={theme.fontFamily.bold}
                      fontSize={'$sm'}
                      fontWeight={'$medium'}
                      color={theme.colors.primary.DEFAULT}>
                      View all
                    </Text>
                  </HStack>
                </View>
              }
              ListEmptyComponent={
                <Center mt={'$32'}>
                  <Text
                    fontFamily={theme.fontFamily.bold}
                    color={theme.colors.grey.solid}
                    fontWeight={'$medium'}
                    fontSize={'$lg'}>
                    Nothing to show
                  </Text>
                  <Text
                    fontFamily={theme.fontFamily.regular}
                    fontWeight={'$medium'}
                    fontSize={'$sm'}
                    color={theme.colors.grey[200]}
                    mt={'$3'}>
                    Your recent verifications will show up here
                  </Text>
                </Center>
              }
              ItemSeparatorComponent={Separator}
              ListFooterComponent={<View h={'$32'} />}
              data={trendingData}
              renderItem={({item}) => (
                <VerificationTable data={item} handclick={handleClick} />
              )}
              keyExtractor={(item: any) => item._id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </Center>
      </SafeAreaView>
    </View>
  );
}
