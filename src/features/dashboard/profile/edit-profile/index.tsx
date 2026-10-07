import React from 'react';
import {theme} from '@/providers/theme-provider';
import {
  Center,
  View,
  StatusBar,
  SafeAreaView,
  Text,
  Input,
  InputField,
  VStack,
  Button,
  ButtonText,
  Avatar,
  AvatarImage,
  ButtonSpinner,
  AvatarFallbackText,
} from '@gluestack-ui/themed';
import {Header} from './header';
import {useProfile} from '@/common/hooks/profile';
import {TouchableOpacity} from 'react-native';

export function EditProfile() {
  const {data, handleProileUpdate, handleSubmit, payload, isLoading} =
    useProfile();

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
          <VStack
            space={'2xl'}
            h={'auto'}
            w={'85%'}
            overflow={'hidden'}
            mt={'$4'}>
            <Center>
              <Avatar
                bgColor={theme.colors.grey[500]}
                size="2xl"
                borderRadius="$full">
                <AvatarFallbackText>{`${data?.data?.user?.firstName} ${
                  data?.data?.user?.lastName || ''
                }`}</AvatarFallbackText>
                {data?.data?.imageUrl ? (
                  <AvatarImage
                    source={{
                      uri: data?.data?.imageUrl,
                    }}
                    alt="image"
                  />
                ) : null}
              </Avatar>
              <TouchableOpacity onPress={handleProileUpdate}>
                <Text
                  fontFamily={theme.fontFamily.medium}
                  color={theme.colors.grey.solid}
                  textTransform={'capitalize'}
                  fontSize={'$md'}
                  mt={'$1'}>
                  Tap to change photo
                </Text>
              </TouchableOpacity>
            </Center>

            <VStack space={'sm'}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey[200]}>
                First Name
              </Text>
              <Input size={'xl'} isDisabled={true}>
                <InputField
                  placeholder={'Enter your first name'}
                  placeholderTextColor={theme.colors.grey[300]}
                  value={data?.data?.user?.firstName}
                />
              </Input>
            </VStack>

            <VStack space={'sm'}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey[200]}>
                Surname
              </Text>
              <Input size={'xl'} isDisabled={true}>
                <InputField
                  placeholder={'Enter your surname'}
                  placeholderTextColor={theme.colors.grey[300]}
                  value={''}
                />
              </Input>
            </VStack>

            <VStack space={'sm'}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey[200]}>
                Phone Number
              </Text>
              <Input size={'xl'} isDisabled={true}>
                <InputField
                  placeholder={'Enter your phone number'}
                  placeholderTextColor={theme.colors.grey[300]}
                  value={`${data?.data?.user?.phoneNumber?.countryCode}${data?.data?.user?.phoneNumber?.number}`}
                />
              </Input>
            </VStack>

            <VStack space={'sm'}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey[200]}>
                Email Address
              </Text>
              <Input size={'xl'} isDisabled={true}>
                <InputField
                  placeholder={'Enter your email address'}
                  placeholderTextColor={theme.colors.grey[300]}
                  value={data?.data?.user?.email}
                />
              </Input>
            </VStack>

            <Button
              bg={theme.colors.primary.DEFAULT}
              size={'lg'}
              mt={'$2'}
              disabled={!payload ? true : false}
              isDisabled={isLoading}
              onPress={handleSubmit}>
              <ButtonText>Save Changes</ButtonText>
              {isLoading && <ButtonSpinner ml="$1" />}
            </Button>
          </VStack>
        </Center>
      </SafeAreaView>
    </View>
  );
}
