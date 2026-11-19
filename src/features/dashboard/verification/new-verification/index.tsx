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
import React, {useState} from 'react';
import {formatDistance} from '@/utils/distance';
import {useNewVerification} from '@/common/hooks/new-verification';
import {DimensionValue, TouchableOpacity} from 'react-native';
import {StepOne} from './step-one';
import {StepTwo} from './step-two';
import {StepThree} from './step-three';
import {StepFour} from './step-four';
import {ButtonSpinner} from '@gluestack-ui/themed';
import {Submit} from './submit';
import {useDisclosure} from '@/common/hooks/useDisclosure';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import {useOnsiteFormQuery} from '@/apis/onsite-form';
import {ERoutes} from '@/common/enum/routes';
import {TNavigation} from '@/common/types/navigation';
import {useAppDispatch} from '@/common/hooks/redux';
import {setToast} from '@/common/component/toast/slice';
import {useIsOnline} from '@/common/hooks/online';
import {missingInForm} from '../onsite-form/missing';

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
    handleRecordVideo,
    handleRemoveVideo,
    video,
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
    distance,
    hasLocation,
    maxDistance,
    jobLabel,
  } = useNewVerification();
  // Credit and Loans KYC: the onsite KYC form, on the visit at the business.
  const {navigate} = useNavigation<TNavigation>();
  const {params}: any = useRoute();
  const addressId: string = params?.data;
  const dispatch = useAppDispatch();
  const online = useIsOnline();
  const onsite = useOnsiteFormQuery(addressId, {skip: !addressId || !online});
  useFocusEffect(
    React.useCallback(() => {
      if (addressId && online) {
        onsite.refetch();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressId, online]),
  );
  const onsiteForm = onsite.data?.data;
  const onsiteMissing = onsiteForm?.applies
    ? missingInForm(onsiteForm.definition, onsiteForm.answers || {})
    : [];
  const openOnsite = () => navigate(ERoutes.ONSITE_FORM, {addressId});
  // A verified visit needs the form complete; a not-verified one does not.
  const submitVisit = (value?: string, reason?: string) => {
    if (
      value === 'verified' &&
      onsiteForm?.applies &&
      onsiteForm?.required !== false &&
      onsiteMissing.length
    ) {
      onClose();
      dispatch(
        setToast({
          title: 'Finish the onsite KYC form first',
          description: `${onsiteMissing.length} required answers still needed.`,
          type: 'error',
        }),
      );
      return openOnsite();
    }
    return handleNext(value, reason);
  };
  // Stop the page scrolling while the agent draws a signature, so strokes are not lost.
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const far =
    hasLocation && Number.isFinite(distance) && distance >= maxDistance;

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          h={'$full'}
          scrollEnabled={scrollEnabled}>
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

              <View
                mt={'$4'}
                py={'$2'}
                px={'$3'}
                borderRadius={'$md'}
                bg={!hasLocation || far ? '#FFF6E5' : '#ECFDF3'}>
                <Text fontSize={'$sm'} color={theme.colors.grey.solid}>
                  {!hasLocation
                    ? 'Finding your location… keep location on.'
                    : Number.isFinite(distance)
                    ? far
                      ? `You are ${formatDistance(
                          distance,
                        )} from the address pin. If this is the right building you can still submit; it will be marked for review.`
                      : `You are ${formatDistance(distance)} from the address.`
                    : 'Location found.'}
                </Text>
              </View>

              {Boolean(jobLabel) && (
                <View
                  mt={'$3'}
                  p={'$3'}
                  borderRadius={'$md'}
                  bg={'#FFF7E6'}
                  borderWidth={1}
                  borderColor={'#F5C36B'}>
                  <Text
                    fontFamily={theme.fontFamily.medium}
                    color={'#7A4B00'}
                    fontSize={'$sm'}>
                    {jobLabel}
                  </Text>
                </View>
              )}

              {Boolean(onsiteForm?.applies) && (
                <TouchableOpacity onPress={openOnsite}>
                  <View
                    mt={'$3'}
                    p={'$3'}
                    borderRadius={'$md'}
                    borderWidth={1}
                    borderColor={onsiteMissing.length ? '#F5C36B' : '#75E0A7'}
                    bg={onsiteMissing.length ? '#FFFAEB' : '#ECFDF3'}>
                    <Text
                      fontFamily={theme.fontFamily.medium}
                      color={theme.colors.primary.DEFAULT}>
                      Onsite KYC form (Credit and Loans)
                    </Text>
                    <Text fontSize={'$sm'} color={theme.colors.grey.solid}>
                      {onsiteMissing.length
                        ? `${onsiteMissing.length} required answers still needed. Tap to fill it in.`
                        : 'Complete. Tap to review or change it.'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              <VStack space={'4xl'} h={'$full'}>
                <View mt={'$6'}>
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
                      video={video}
                      onRecordVideo={handleRecordVideo}
                      onRemoveVideo={handleRemoveVideo}
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
                      onDrawStart={() => setScrollEnabled(false)}
                      onDrawEnd={() => setScrollEnabled(true)}
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
      <Submit isOpen={isOpen} onClose={onClose} handleSubmit={submitVisit} />
    </View>
  );
}
