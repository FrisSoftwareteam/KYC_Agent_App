import {theme} from '@/providers/theme-provider';
import {
  Center,
  View,
  StatusBar,
  SafeAreaView,
  Text,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  FlatList,
  Button,
  ButtonText,
  HStack,
  VStack,
  Image,
} from '@gluestack-ui/themed';
import React from 'react';
import {Separator} from '@/common/component/ui/separator';
import {ScrollView} from 'react-native-gesture-handler';
import {verificationState} from './data';
import {VerificationTable} from '@/common/component/table';
import img from '@/assets/images/verification/img-1.png';
import {Sheet} from './sheet';
import {useVerification} from '@/common/hooks/verification';
import {RefreshControl} from '@gluestack-ui/themed';

export default function Verification() {
  const {
    isOpen,
    filter,
    singleAdress,
    data,
    refreshing,
    onRefresh,
    onClose,
    handleClick,
    setFilter,
    handleNewVerification,
    handleLimit,
  } = useVerification();

  return (
    <View w={'$full'} h={'$full'} bg={theme.colors.primary.white}>
      <StatusBar
        animated={true}
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      />
      <SafeAreaView>
        <Center
          h={'$12'}
          w={'$full'}
          shadowColor={theme.colors.primary.white}
          shadowOffset={{width: 0, height: 8}}
          borderBottomColor={theme.colors.grey[500]}
          borderBottomWidth={'$4'}>
          <Text
            color={theme.colors.primary.DEFAULT}
            fontFamily={theme.fontFamily.bold}
            fontWeight={'$medium'}
            fontSize={'$md'}>
            Verifications
          </Text>
        </Center>
        <Center w={'$full'} h={'auto'}>
          <View h={'auto'} w={'85%'} overflow={'hidden'} mt={'$4'}>
            <FlatList
              ListHeaderComponent={
                <View>
                  <Input borderColor={theme.colors.grey[400]} h={'$12'}>
                    <InputSlot pl="$3">
                      <InputIcon as={SearchIcon} />
                    </InputSlot>
                    <InputField placeholder="Search names, addresses, verification type" />
                  </Input>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={'lg'} mt={'$10'}>
                      {verificationState.map(item => (
                        <Button
                          key={item.id}
                          bg={
                            item.id === filter.id
                              ? theme.colors.primary.DEFAULT
                              : theme.colors.primary.white
                          }
                          borderColor={
                            item.id === filter.id
                              ? theme.colors.primary.DEFAULT
                              : theme.colors.grey[200]
                          }
                          borderWidth={'$1'}
                          h={'$12'}
                          borderRadius={'$3xl'}
                          onPress={() => setFilter(item)}>
                          <ButtonText
                            color={
                              item.id === filter.id
                                ? theme.colors.primary.white
                                : theme.colors.grey[200]
                            }>
                            {item.name}
                          </ButtonText>
                        </Button>
                      ))}
                    </HStack>
                  </ScrollView>
                </View>
              }
              ListEmptyComponent={
                <VStack
                  w={'$full'}
                  alignItems={'center'}
                  mt={'$32'}
                  space={'xl'}>
                  <Center w={'$full'}>
                    <Image source={img} alt="Image one" w={'$40'} h={'$40'} />
                  </Center>
                  <Center mt={'$2'}>
                    <Text
                      fontFamily={theme.fontFamily.bold}
                      color={theme.colors.grey.solid}
                      fontWeight={'$medium'}
                      fontSize={'$lg'}>
                      No verifications
                    </Text>
                    <Text
                      fontFamily={theme.fontFamily.regular}
                      fontWeight={'$medium'}
                      fontSize={'$sm'}
                      color={theme.colors.grey[200]}
                      mt={'$3'}>
                      {filter?.no_data}
                    </Text>
                  </Center>
                </VStack>
              }
              ItemSeparatorComponent={Separator}
              ListFooterComponent={<View h={'$32'} />}
              data={data}
              renderItem={({item}) => (
                <VerificationTable data={item} handclick={handleClick} />
              )}
              keyExtractor={(item: any) => item._id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReachedThreshold={0.1}
              onEndReached={handleLimit}
            />
          </View>
          <Sheet
            isOpen={isOpen}
            onClose={onClose}
            data={singleAdress}
            handleNewVerification={handleNewVerification}
          />
        </Center>
      </SafeAreaView>
    </View>
  );
}
