import {theme} from '@/providers/theme-provider';
import {formatDate} from '@/utils/date-format';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Center,
  HStack,
  Pressable,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import {MapPin, X} from 'lucide-react-native';
import React from 'react';
import {Motion} from '@legendapp/motion';
import {Easing, TouchableOpacity} from 'react-native';
import {openGoogleMap} from '@/utils';

type TSheet = {
  isOpen: boolean;
  onClose: () => void;
  handleNewVerification: () => void;
  data: any;
};

export function Sheet({isOpen, onClose, data, handleNewVerification}: TSheet) {
  return (
    <Motion.View
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{
        type: 'timing',
        duration: 3000,
        easing: Easing.in(Easing.ease),
      }}>
      <Actionsheet isOpen={isOpen} onClose={onClose} zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent minHeight={'$80'} zIndex={999}>
          <View bg={'#F7F7FF'} w={'$full'} h={'$40'}>
            <Center w={'$full'} h={'auto'}>
              <Center
                h={'$full'}
                w={'85%'}
                overflow={'hidden'}
                position={'relative'}>
                <Avatar
                  bgColor={theme.colors.grey[500]}
                  size="lg"
                  borderRadius="$full">
                  <AvatarFallbackText>{`${data?.candidate?.firstName} ${
                    data?.candidate?.lastName || ''
                  }`}</AvatarFallbackText>
                  {data?.candidate?.imageUrl ? (
                    <AvatarImage
                      source={{
                        uri: data?.candidate?.imageUrl,
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
                  {`${data?.candidate?.firstName || 'N/A'} ${
                    data?.candidate?.lastName || 'N/A'
                  }`}
                </Text>
                <View
                  position={'absolute'}
                  right={0}
                  top={'$2'}
                  zIndex={2}
                  bg={theme.colors.primary.white}
                  borderRadius={'$full'}
                  p={'$1'}>
                  <TouchableOpacity onPress={onClose}>
                    <X width={20} height={20} color={theme.colors.grey.solid} />
                  </TouchableOpacity>
                </View>
              </Center>
            </Center>
          </View>
          <View w={'$full'} mt={'$4'}>
            <Center w={'$full'} h={'auto'}>
              <VStack
                space={'2xl'}
                h={'auto'}
                w={'85%'}
                overflow={'hidden'}
                position={'relative'}>
                <VStack space={'sm'}>
                  <Text
                    color={theme.colors.grey[200]}
                    fontFamily={theme.fontFamily.regular}
                    fontSize={'$xs'}>
                    Type
                  </Text>
                  <Text
                    color={theme.colors.grey.solid}
                    fontFamily={theme.fontFamily.medium}
                    fontSize={'$md'}>
                    {data?.category}
                  </Text>
                </VStack>

                <VStack space={'sm'}>
                  <Text
                    color={theme.colors.grey[200]}
                    fontFamily={theme.fontFamily.regular}
                    fontSize={'$xs'}>
                    Address
                  </Text>

                  <Text
                    color={theme.colors.grey.solid}
                    fontFamily={theme.fontFamily.medium}
                    fontSize={'$md'}>
                    {data?.formatAddress}
                  </Text>

                  <Pressable>
                    <HStack alignItems={'center'} gap={'$1'}>
                      <MapPin
                        width={14}
                        height={14}
                        color={theme.colors.status.started}
                      />
                      <TouchableOpacity
                        onPress={() => openGoogleMap(data?.googleMapUrl)}>
                        <Text
                          color={theme.colors.status.started}
                          fontSize={'$md'}
                          fontFamily={theme.fontFamily.regular}>
                          View address in map
                        </Text>
                      </TouchableOpacity>
                    </HStack>
                  </Pressable>
                </VStack>

                <VStack space={'sm'}>
                  <Text
                    color={theme.colors.grey[200]}
                    fontFamily={theme.fontFamily.regular}
                    fontSize={'$xs'}>
                    Date
                  </Text>
                  <Text
                    color={theme.colors.grey.solid}
                    fontFamily={theme.fontFamily.medium}
                    fontSize={'$md'}>
                    {formatDate(data?.createdAt)}
                  </Text>
                </VStack>
              </VStack>

              <Center
                mt={'$5'}
                mb={'$10'}
                borderColor={theme.colors.grey[500]}
                borderTopWidth={'$1'}
                w={'$full'}>
                <VStack space={'2xl'} h={'auto'} w={'85%'} pt={'$5'}>
                  {['accepted', 'inprogress'].includes(
                    data?.status?.toLowerCase(),
                  ) && (
                    <Button
                      bg={theme.colors.primary.DEFAULT}
                      h={'$12'}
                      onPress={handleNewVerification}>
                      <ButtonText>
                        {data?.status === 'accepted'
                          ? 'Start verification'
                          : 'Continue verification'}
                      </ButtonText>
                    </Button>
                  )}
                  <Button
                    bg={theme.colors.primary.white}
                    borderColor={theme.colors.primary.DEFAULT}
                    borderWidth={'$1'}
                    h={'$12'}
                    onPress={onClose}>
                    <ButtonText color={theme.colors.primary.DEFAULT}>
                      Cancel
                    </ButtonText>
                  </Button>
                </VStack>
              </Center>
            </Center>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </Motion.View>
  );
}
