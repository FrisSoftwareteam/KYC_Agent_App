import {theme} from '@/providers/theme-provider';
import {
  Center,
  View,
  StatusBar,
  SafeAreaView,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  ScrollView,
} from '@gluestack-ui/themed';
import {X} from 'lucide-react-native';
import React from 'react';
import {useNewVerification} from '@/common/hooks/new-verification';
import {DimensionValue, TouchableOpacity} from 'react-native';
import {StepOne} from './step-one';
import {StepTwo} from './step-two';
import {StepThree} from './step-three';
import {StepFour} from './step-four';
import {ButtonSpinner} from '@gluestack-ui/themed';
import {Submit} from './submit';
import {useDisclosure} from '@/common/hooks/useDisclosure';

export function NewVerification() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {
    payload,
    step,
    handleChange,
    handleNext,
    handlePrev,
    validatePayload,
    handleImageUpload,
    handleSignature,
    handleEnd,
    onStartRecord,
    onStopRecord,
    onStartPlay,
    onPausePlay,
    handleRedoSignature,
    handleUndoSignature,
    playTime,
    play,
    recorded,
    recording,
    recordTime,
    images,
    notes,
    SignatureRef,
    addressUpdateIsLoading,
    signature,
  } = useNewVerification();

  return (
    <View w={'$full'} h={'$full'} bg={theme.colors.primary.white}>
      <StatusBar
        animated={true}
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      />
      <View
        h={'$2'}
        w={'$full'}
        shadowColor={theme.colors.primary.white}
        shadowOffset={{width: 0, height: 8}}
        borderBottomColor={theme.colors.grey[500]}
        borderBottomWidth={'$1'}
      />
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false} h={'$full'}>
          <Center w={'$full'} h={'$full'}>
            <View h={'$full'} w={'85%'} overflow={'hidden'} mt={'$5'}>
              <HStack alignItems={'center'} w={'$full'}>
                <HStack alignItems={'center'} w={'$5/6'} space={'sm'}>
                  <TouchableOpacity onPress={() => handlePrev('cancel')}>
                    <View
                      bg={theme.colors.primary.white}
                      borderRadius={'$full'}
                      p={'$1'}>
                      <X
                        width={20}
                        height={20}
                        color={theme.colors.grey.solid}
                      />
                    </View>
                  </TouchableOpacity>
                  <VStack
                    w={'90%'}
                    h={'$3'}
                    borderColor={'#CDD7EB'}
                    borderWidth={'$1'}
                    borderRadius={'$full'}
                    bg={theme.colors.grey[500]}>
                    <View
                      bg={theme.colors.primary.DEFAULT}
                      w={`$${step}/4` as DimensionValue}
                      h={'$full'}
                      borderRadius={'$full'}
                    />
                  </VStack>
                </HStack>
                <HStack w={'$1/6'} justifyContent={'flex-end'}>
                  <View
                    bg={'#F7F7FF'}
                    py={'$1'}
                    px={'$2'}
                    borderRadius={'$full'}
                    borderColor={'#CDD7EB'}
                    borderWidth={'$1'}>
                    <Text>{step}/4</Text>
                  </View>
                </HStack>
              </HStack>

              <VStack space={'4xl'} h={'$full'}>
                <View mt={'$8'}>
                  {step === 1 && (
                    <StepOne payload={payload} handleChange={handleChange} />
                  )}

                  {step === 2 && (
                    <StepTwo
                      handleImageUpload={handleImageUpload}
                      images={images}
                    />
                  )}

                  {step === 3 && (
                    <StepThree
                      handleChange={handleChange}
                      notes={notes}
                      onStartRecord={onStartRecord}
                      onStopRecord={onStopRecord}
                      onStartPlay={onStartPlay}
                      onPausePlay={onPausePlay}
                      recording={recording}
                      recordTime={recordTime}
                      recorded={recorded}
                      playTime={playTime}
                      play={play}
                    />
                  )}

                  {step === 4 && (
                    <StepFour
                      SignatureRef={SignatureRef}
                      handleSignature={handleSignature}
                      handleEnd={handleEnd}
                      handleChange={handleChange}
                      handleRedoSignature={handleRedoSignature}
                      handleUndoSignature={handleUndoSignature}
                      signature={signature}
                    />
                  )}
                </View>

                <HStack w={'$full'} justifyContent={'space-between'} gap={'$4'}>
                  <Button
                    variant={'outline'}
                    w={'45%'}
                    borderColor={theme.colors.primary.DEFAULT}
                    onPress={() => handlePrev()}>
                    <ButtonText color={theme.colors.primary.DEFAULT}>
                      {step === 1 ? 'Cancel' : 'Back'}
                    </ButtonText>
                  </Button>

                  {step === 4 ? (
                    <Button
                      variant={'solid'}
                      isDisabled={
                        !validatePayload(payload) || addressUpdateIsLoading
                      }
                      w={'45%'}
                      bg={theme.colors.primary.DEFAULT}
                      onPress={onOpen}>
                      <ButtonText>Submit</ButtonText>
                      {addressUpdateIsLoading && (
                        <ButtonSpinner
                          ml="$1"
                          color={theme.colors.primary.white}
                        />
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant={'solid'}
                      isDisabled={!validatePayload(payload)}
                      w={'45%'}
                      bg={theme.colors.primary.DEFAULT}
                      onPress={() => handleNext()}>
                      <ButtonText> Next</ButtonText>
                    </Button>
                  )}
                </HStack>
              </VStack>
            </View>
          </Center>
        </ScrollView>
      </SafeAreaView>
      <Submit isOpen={isOpen} onClose={onClose} handleSubmit={handleNext} />
    </View>
  );
}
