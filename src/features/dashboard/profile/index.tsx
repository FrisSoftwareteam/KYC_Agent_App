import {ERoutes} from '@/common/enum/routes';
import {useProfile} from '@/common/hooks/profile';
import {theme} from '@/providers/theme-provider';
import {AvatarFallbackText, Pressable, Switch} from '@gluestack-ui/themed';
import {
  Avatar,
  AvatarImage,
  Button,
  ButtonText,
  Center,
  HStack,
  SafeAreaView,
  StatusBar,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import {ChevronRight} from 'lucide-react-native';
import React from 'react';
import {formatNaira} from '@/common/hooks/wallet';

export function Profile() {
  const {data, navigate, status, handleStatus, handleLogout, handleGuide} =
    useProfile();

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
            Profile
          </Text>
        </Center>
        <Center w={'$full'} h={'auto'}>
          <View h={'auto'} w={'85%'} overflow={'hidden'} mt={'$4'}>
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
              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey.solid}
                textTransform={'capitalize'}
                fontSize={'$md'}
                mt={'$1'}>
                {`${data?.data?.user?.firstName} ${
                  data?.data?.user?.lastName || ''
                }`}
              </Text>
            </Center>

            <Button
              variant={'link'}
              mt={'$8'}
              borderColor={theme.colors.grey.solid}
              borderWidth={'$1'}
              borderRadius={'$sm'}
              w={'$full'}
              onPress={() => navigate(ERoutes.EDIT_PROFILE)}>
              <ButtonText color={theme.colors.grey.solid}>
                Edit Profile
              </ButtonText>
            </Button>

            <HStack
              justifyContent={'space-between'}
              alignItems={'flex-start'}
              mt={'$7'}>
              <VStack space={'xs'} w={'80%'}>
                <Text
                  fontFamily={theme.fontFamily.medium}
                  color={theme.colors.grey.solid}>
                  Stay Online
                </Text>
                <Text
                  fontFamily={theme.fontFamily.regular}
                  color={theme.colors.grey[200]}
                  fontSize={'$md'}>
                  If turned off, you won’t be able to get new verification tasks
                </Text>
              </VStack>
              <Switch
                defaultValue={true}
                onValueChange={e => handleStatus(e)}
                value={status === 'online' ? true : false}
                sx={{
                  props: {
                    trackColor: {
                      false: theme.colors.grey[300],
                      true: theme.colors.status.success,
                    },
                  },
                }}
              />
            </HStack>

            <Pressable onPress={() => navigate(ERoutes.WALLET)}>
              <HStack
                justifyContent={'space-between'}
                alignItems={'center'}
                borderColor={theme.colors.grey[500]}
                borderTopWidth={'$1'}
                mt={'$4'}
                pt={'$8'}
                pb={'$5'}>
                <Text>Wallet</Text>
                <HStack alignItems={'center'} space={'sm'}>
                  <Text
                    color={theme.colors.status.success}
                    fontFamily={theme.fontFamily.medium}>
                    {formatNaira(data?.data?.wallet?.withdrawable)}
                  </Text>
                  <ChevronRight
                    width={20}
                    height={20}
                    color={theme.colors.grey.solid}
                  />
                </HStack>
              </HStack>
            </Pressable>

            <Pressable onPress={() => navigate(ERoutes.CHANGE_PASSWORD)}>
              <HStack
                justifyContent={'space-between'}
                borderColor={theme.colors.grey[500]}
                borderBottomWidth={'$1'}
                borderTopWidth={'$1'}
                mt={'$0'}
                pt={'$8'}
                pb={'$5'}>
                <Text>Change Password</Text>
                <ChevronRight
                  width={20}
                  height={20}
                  color={theme.colors.grey.solid}
                />
              </HStack>
            </Pressable>

            <Pressable onPress={handleGuide}>
              <HStack
                justifyContent={'space-between'}
                borderColor={theme.colors.grey[500]}
                borderBottomWidth={'$1'}
                mt={'$2'}
                pt={'$8'}
                pb={'$5'}>
                <Text>Verification guide</Text>
              </HStack>
            </Pressable>

            <Pressable mt={'$7'} onPress={handleLogout}>
              <Text
                color={theme.colors.status.error}
                fontFamily={theme.fontFamily.medium}
                fontSize={'$lg'}>
                Sign Out
              </Text>
            </Pressable>
          </View>
        </Center>
      </SafeAreaView>
    </View>
  );
}
