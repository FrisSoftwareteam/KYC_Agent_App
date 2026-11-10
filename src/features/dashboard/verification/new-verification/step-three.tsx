import AudioLogo from '@/assets/svgs/audio';
import DeleteLogo from '@/assets/svgs/delete';
import PauseLogo from '@/assets/svgs/pause';
import PlayLogo from '@/assets/svgs/play';
import {theme} from '@/providers/theme-provider';
import {formatTime, getPercentage, playPercentage} from '@/utils/format-time';
import {
  VStack,
  View,
  Text,
  Textarea,
  TextareaInput,
  HStack,
  Center,
  Progress,
  ProgressFilledTrack,
  CloseIcon,
  Icon,
} from '@gluestack-ui/themed';
import {Info} from 'lucide-react-native';
import React, {Fragment} from 'react';
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

const CommentSection = ({title, value, handleChange}: any) => (
  <VStack space={'sm'}>
    <Text
      fontFamily={theme.fontFamily.medium}
      color={theme.colors.grey[200]}
      fontSize={'$md'}>
      {title}
    </Text>
    <Textarea size="lg">
      <TextareaInput
        placeholder="Type your comments here..."
        onChangeText={handleChange}
        value={value}
      />
    </Textarea>
  </VStack>
);

export function StepThree({
  handleChange,
  notes,
  onStartRecord,
  onStopRecord,
  onStartPlay,
  onPausePlay,
  recording,
  recordTime,
  recorded,
  playTime,
  play,
  video,
  onRecordVideo,
  onRemoveVideo,
}: any) {
  return (
    <View>
      <Text
        color={theme.colors.primary.DEFAULT}
        fontFamily={theme.fontFamily.medium}
        fontSize={'$lg'}>
        Additional Information
      </Text>
      <VStack
        mt={'$3'}
        w={'$full'}
        minHeight={'$20'}
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
            mb={'$4'}
          />
          <Text
            fontFamily={theme.fontFamily.medium}
            color={theme.colors.grey.solid}
            fontWeight={'$light'}
            lineHeight={'$md'}
            fontSize={'$sm'}>
            Voice comment should only be from someone that can verify the
            address (neighbour, security personnel etc).
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
            Different comment should be on different box
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
            Comment should be detailed and brief
          </Text>
        </HStack>
      </VStack>
      <VStack
        mt={'$3'}
        w={'$full'}
        bg={'#F3F6FF'}
        borderLeftWidth={3}
        borderRadius={'$lg'}
        px={'$4'}
        py={'$2.5'}
        space={'sm'}
        borderLeftColor={theme.colors.primary.DEFAULT}>
        <HStack alignItems={'center'} space={'xs'}>
          <Info width={14} height={14} color={theme.colors.primary.DEFAULT} />
          <Text
            fontFamily={theme.fontFamily.medium}
            color={theme.colors.primary.DEFAULT}
            fontSize={'$md'}>
            Field verification instructions
          </Text>
        </HStack>
        <Bullet>
          Do not photograph any person providing comments or information
          during verification.
        </Bullet>
        <Bullet>
          Exercise discretion when making enquiries and collecting information.
        </Bullet>
        <Bullet>
          Conduct all verification activities professionally, without drawing
          unnecessary attention or compromising the privacy of respondents.
        </Bullet>
      </VStack>

      <VStack space={'lg'} mt={'$4'}>
        <VStack space={'sm'}>
          <Text
            fontFamily={theme.fontFamily.medium}
            color={theme.colors.grey[200]}
            fontSize={'$md'}>
            Voice Comment (required)
          </Text>
          {!recorded && !recording && (
            <Text fontSize={'$xs'} color={theme.colors.grey[200]}>
              Say what you found at the address. You cannot continue without a
              voice comment.
            </Text>
          )}

          {!recorded ? (
            <HStack
              borderColor={theme.colors.grey[400]}
              h={'$12'}
              w={'$full'}
              borderWidth={'$1'}
              borderRadius={'$sm'}
              px={'$2'}
              justifyContent={'space-between'}>
              {!recording ? (
                <Fragment>
                  <Center>
                    <TouchableOpacity onPress={onStartRecord}>
                      <Text
                        fontFamily={theme.fontFamily.regular}
                        color={theme.colors.grey[200]}
                        fontWeight={'$normal'}>
                        Tap to record
                      </Text>
                    </TouchableOpacity>
                  </Center>
                  <Center pr={'$1.5'}>
                    <TouchableOpacity onPress={onStartRecord}>
                      <AudioLogo />
                    </TouchableOpacity>
                  </Center>
                </Fragment>
              ) : (
                <HStack w={'$full'}>
                  <HStack w={'$5/6'} space={'sm'}>
                    <TouchableOpacity onPress={() => onStopRecord('cancel')}>
                      <Center h={'$full'}>
                        <View
                          h={'$4'}
                          w={'$4'}
                          bg={theme.colors.grey[200]}
                          borderRadius={'$full'}
                          justifyContent={'center'}
                          alignItems={'center'}>
                          <Icon
                            as={CloseIcon}
                            color={theme.colors.primary.white}
                            w={'$3.5'}
                          />
                        </View>
                      </Center>
                    </TouchableOpacity>
                    <Center w={'$full'}>
                      <Progress
                        value={getPercentage(recordTime)}
                        w={'90%'}
                        size={'md'}>
                        <ProgressFilledTrack
                          bgColor={theme.colors.primary.DEFAULT}
                        />
                      </Progress>
                    </Center>
                  </HStack>
                  <HStack w={'$1/6'} justifyContent={'flex-end'} space={'sm'}>
                    <Center>
                      <Text
                        fontWeight={'$bold'}
                        fontFamily={theme.fontFamily.regular}>
                        {formatTime(recordTime)}
                      </Text>
                    </Center>
                    <TouchableOpacity onPress={() => onStopRecord('')}>
                      <Center h={'$full'}>
                        <View
                          h={'$4'}
                          w={'$4'}
                          bg={theme.colors.status.error}
                          borderRadius={'$full'}
                          justifyContent={'center'}
                          alignItems={'center'}>
                          <View
                            h={'$2'}
                            w={'$2'}
                            bg={theme.colors.primary.white}
                          />
                        </View>
                      </Center>
                    </TouchableOpacity>
                  </HStack>
                </HStack>
              )}
            </HStack>
          ) : (
            <HStack
              borderColor={theme.colors.grey[400]}
              h={'$12'}
              borderWidth={'$1'}
              borderRadius={'$sm'}
              px={'$3'}
              justifyContent={'space-between'}>
              <HStack w={'$5/6'} space={'sm'}>
                <TouchableOpacity onPress={() => onStopRecord('cancel')}>
                  <Center h={'$full'}>
                    <DeleteLogo />
                  </Center>
                </TouchableOpacity>
                <Center w={'$full'}>
                  <Progress
                    value={playPercentage(recordTime, playTime)}
                    w={'90%'}
                    size={'md'}>
                    <ProgressFilledTrack
                      bgColor={theme.colors.primary.DEFAULT}
                    />
                  </Progress>
                </Center>
              </HStack>
              <HStack w={'$1/6'} justifyContent={'flex-end'} space={'sm'}>
                <Center>
                  <Text
                    fontWeight={'$bold'}
                    fontFamily={theme.fontFamily.regular}>
                    {formatTime(recordTime)}
                  </Text>
                </Center>
                <TouchableOpacity onPress={play ? onPausePlay : onStartPlay}>
                  <Center h={'$full'}>
                    {play ? <PauseLogo /> : <PlayLogo />}
                  </Center>
                </TouchableOpacity>
              </HStack>
            </HStack>
          )}
        </VStack>

        <VStack space={'sm'}>
          <Text
            fontFamily={theme.fontFamily.medium}
            color={theme.colors.grey[200]}
            fontSize={'$md'}>
            Video of the building (required, up to 30 seconds)
          </Text>
          <HStack
            borderColor={theme.colors.grey[400]}
            h={'$12'}
            borderWidth={'$1'}
            borderRadius={'$sm'}
            px={'$3'}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <Text
              fontFamily={theme.fontFamily.regular}
              color={video ? theme.colors.grey.solid : theme.colors.grey[200]}>
              {video ? 'Video recorded' : 'Walk round the front of the building'}
            </Text>
            <HStack space={'md'}>
              {video ? (
                <TouchableOpacity onPress={onRemoveVideo}>
                  <DeleteLogo />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={onRecordVideo}>
                <Text
                  fontFamily={theme.fontFamily.medium}
                  color={theme.colors.primary.DEFAULT}>
                  {video ? 'Retake' : 'Record video'}
                </Text>
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>

        <CommentSection
          title="Agent’s First Comments"
          value={notes.first}
          handleChange={(e: any) => handleChange(e, 'first')}
        />
        <CommentSection
          title="Agent’s Second Comments"
          value={notes.second}
          handleChange={(e: any) => handleChange(e, 'second')}
        />
        <CommentSection
          title="Agent’s Third Comments"
          value={notes.third}
          handleChange={(e: any) => handleChange(e, 'third')}
        />
      </VStack>
    </View>
  );
}
