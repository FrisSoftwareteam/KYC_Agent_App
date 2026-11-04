import {theme} from '@/providers/theme-provider';
import {Center, HStack, Image, Text, VStack, View} from '@gluestack-ui/themed';
import React from 'react';
import {Info, Plus} from 'lucide-react-native';
import {TouchableOpacity} from 'react-native';

const Bullet = ({children}: {children: React.ReactNode}) => (
  <HStack alignItems={'flex-start'} space={'xs'}>
    <View
      h={'$1.5'}
      w={'$1.5'}
      mt={'$2'}
      bg={theme.colors.grey.solid}
      borderRadius={'$full'}
    />
    <Text
      flex={1}
      fontFamily={theme.fontFamily.medium}
      color={theme.colors.grey.solid}
      lineHeight={'$md'}
      fontSize={'$sm'}>
      {children}
    </Text>
  </HStack>
);

const find = (data: any, name: string) => {
  const res = data?.find((item: {name: string}) => item.name === name);
  return res;
};

const UploadImageButton = ({onPress, image}: any) => (
  <View
    w={'$full'}
    h={'$24'}
    borderStyle={'dashed'}
    borderWidth={'$1'}
    borderRadius={'$md'}
    bg={'#F7F7FF'}
    borderColor={theme.colors.primary.DEFAULT}>
    <TouchableOpacity onPress={onPress}>
      {!image ? (
        <Center h={'$full'}>
          <VStack alignItems={'center'}>
            <Plus color={theme.colors.primary.DEFAULT} />
            <Text
              mt={'$2'}
              color={theme.colors.primary.DEFAULT}
              fontFamily={theme.fontFamily.medium}>
              Add image
            </Text>
          </VStack>
        </Center>
      ) : (
        <Image
          source={{uri: image}}
          alt={image}
          h={'$full'}
          w={'$full'}
          objectFit={'cover'}
        />
      )}
    </TouchableOpacity>
  </View>
);

export const StepTwo = ({handleImageUpload, images}: any) => {
  const renderImageOrButton = (imageKey: string, label: string) => {
    const image = find(images, imageKey)?.value;
    return (
      <VStack w={'47%'} space={'xs'}>
        <Text
          fontFamily={theme.fontFamily.medium}
          color={theme.colors.grey.solid}
          fontSize={'$xs'}>
          {label}
        </Text>
        <UploadImageButton
          onPress={() => handleImageUpload(imageKey)}
          image={image}
        />
      </VStack>
    );
  };

  return (
    <View>
      <Text
        color={theme.colors.primary.DEFAULT}
        fontFamily={theme.fontFamily.medium}
        fontSize={'$lg'}>
        Upload Images
      </Text>
      <VStack space={'4xl'} mt={'$4'}>
        <VStack
          w={'$full'}
          minHeight={'$32'}
          bg={'#FFFBF5'}
          borderLeftWidth={3}
          borderRadius={'$lg'}
          px={'$4'}
          py={'$2.5'}
          space={'sm'}
          borderLeftColor={theme.colors.status.warning}>
          <HStack alignItems={'center'} space={'xs'}>
            <Info width={14} height={14} color={theme.colors.grey.solid} />
            <Text
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey.solid}
              fontWeight={'$light'}
              fontSize={'$md'}>
              Kindly note, for a successful verification
            </Text>
          </HStack>

          <HStack alignItems={'center'} space={'xs'}>
            <View
              h={'$1.5'}
              w={'$1.5'}
              bg={theme.colors.grey.solid}
              borderRadius={'$full'}
            />
            <Text
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey.solid}
              fontWeight={'$light'}
              fontSize={'$sm'}>
              Upload a minimum of 3 images
            </Text>
          </HStack>

          <HStack alignItems={'center'} space={'xs'}>
            <View
              h={'$1.5'}
              w={'$1.5'}
              bg={theme.colors.grey.solid}
              borderRadius={'$full'}
            />
            <Text
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey.solid}
              fontSize={'$sm'}>
              Upload clear images only
            </Text>
          </HStack>

          <Bullet>
            Take these 3 photos: (1) the front view of the building, (2) the
            side view of the building, (3) a distant view of the street showing
            the building and its surroundings.
          </Bullet>
          <Bullet>
            Photos must give a clear view of the property and its location. Do
            not photograph people.
          </Bullet>
        </VStack>

        <VStack>
          <Text
            fontFamily={theme.fontFamily.medium}
            color={theme.colors.grey.solid}
            fontSize={'$md'}>
            Images
          </Text>
          <VStack space={'lg'} mt={'$2'}>
            <HStack space={'lg'} w={'$full'}>
              {renderImageOrButton('img1', '1. Front view of the building')}
              {renderImageOrButton('img2', '2. Side view of the building')}
            </HStack>
            {renderImageOrButton(
              'img3',
              '3. Distant view of the street and surroundings',
            )}
          </VStack>
        </VStack>
      </VStack>
    </View>
  );
};
