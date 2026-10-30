import {useAcceptTaskMutation} from '@/apis/verification';
import {setToast} from '@/common/component/toast/slice';
import {useNearbyJobs} from '@/common/hooks/jobs';
import {useAppDispatch} from '@/common/hooks/redux';
import {theme} from '@/providers/theme-provider';
import {formatDistance} from '@/utils/distance';
import {
  Button,
  ButtonSpinner,
  ButtonText,
  HStack,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import {MapPin} from 'lucide-react-native';
import React, {useState} from 'react';

const NAVY = '#0B2A5B';

// "Jobs near you": open jobs within range, refreshed every 30 seconds while online.
// Agents can accept from here even if the ringing offer never reached the phone.
export function NearbyJobs() {
  const dispatch = useAppDispatch();
  const {online, located, jobs} = useNearbyJobs();
  const [acceptTask] = useAcceptTaskMutation();
  const [busy, setBusy] = useState<string | null>(null);

  const accept = async (job: any) => {
    setBusy(job.addressId);
    try {
      const res = await acceptTask({
        address: job.addressId,
        task: job.verificationId,
        status: 'accept',
      }).unwrap();
      dispatch(
        setToast({
          title: 'Job accepted',
          description: res?.data || 'Find it under Verification, then Pending.',
          type: 'success',
        }),
      );
    } catch (error) {
      dispatch(setToast({description: error, type: 'error'}));
    } finally {
      setBusy(null);
    }
  };

  let hint = '';
  if (!online) {
    hint = 'Go online to see jobs near you.';
  } else if (!located) {
    hint = 'Waiting for your location. Keep location on.';
  } else if (!jobs.length) {
    hint =
      'No open jobs near you right now. This list updates every 30 seconds.';
  }

  return (
    <VStack mb={'$6'}>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <Text
          fontFamily={theme.fontFamily.medium}
          fontSize={'$sm'}
          color={theme.colors.primary.DEFAULT}>
          JOBS NEAR YOU
        </Text>
        {jobs.length ? (
          <View bg={'#FEF3C7'} px={'$2'} py={'$0.5'} borderRadius={'$full'}>
            <Text fontSize={'$xs'} color={'#92400E'}>
              {jobs.length} open
            </Text>
          </View>
        ) : null}
      </HStack>

      {hint ? (
        <Text mt={'$2'} fontSize={'$sm'} color={theme.colors.grey[200]}>
          {hint}
        </Text>
      ) : (
        jobs.map(job => (
          <VStack
            key={job.addressId}
            mt={'$3'}
            p={'$3'}
            borderRadius={'$xl'}
            borderWidth={'$1'}
            borderColor={'#F2D49B'}
            bg={'#FFFBEB'}
            space={'xs'}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <Text
                flex={1}
                fontFamily={theme.fontFamily.bold}
                color={'#1F2937'}
                isTruncated>
                {`${job.candidate?.firstName || ''} ${
                  job.candidate?.lastName || ''
                }`.trim() || 'Candidate'}
              </Text>
              {Number(job.price) > 0 ? (
                <Text fontFamily={theme.fontFamily.bold} color={'#05624F'}>
                  ₦{Number(job.price).toLocaleString()}
                </Text>
              ) : null}
            </HStack>
            <HStack space={'xs'} alignItems={'center'}>
              <MapPin width={13} height={13} color={theme.colors.grey[200]} />
              <Text
                flex={1}
                fontSize={'$sm'}
                color={theme.colors.grey.solid}
                isTruncated>
                {job.address}
              </Text>
            </HStack>
            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              mt={'$1'}>
              <Text fontSize={'$xs'} color={theme.colors.grey[200]}>
                {formatDistance(job.distance)} away
                {job.turnarroundTime
                  ? `  ·  within ${job.turnarroundTime}`
                  : ''}
              </Text>
              <Button
                size={'sm'}
                bg={NAVY}
                borderRadius={'$lg'}
                isDisabled={Boolean(busy)}
                onPress={() => accept(job)}>
                <ButtonText>Accept</ButtonText>
                {busy === job.addressId && <ButtonSpinner ml={'$1'} />}
              </Button>
            </HStack>
          </VStack>
        ))
      )}
    </VStack>
  );
}
