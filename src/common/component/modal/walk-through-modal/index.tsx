import {useAppDispatch, useAppSelector} from '@/common/hooks/redux';
import {theme} from '@/providers/theme-provider';
import {
  View,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogBody,
} from '@gluestack-ui/themed';
import React, {Fragment} from 'react';
import {setWalkThrough} from '@/features/auth/slice';
import {StepOne} from './step-one';
import {StepTwo} from './step-two';
import {StepThree} from './step-three';
import {DimensionValue} from 'react-native';

type IPostiion = {
  [key: string]: {
    [key: string]: String;
  };
};

export function WalkThroughModal() {
  const dispatch = useAppDispatch();
  const {startWalkThrough, walkThroughSteps} = useAppSelector(
    state => state.auth,
  );

  const handleNext = async () => {
    if (walkThroughSteps < 3) {
      dispatch(setWalkThrough({steps: walkThroughSteps + 1, start: true}));
    } else if (walkThroughSteps === 3) {
      dispatch(setWalkThrough({steps: walkThroughSteps + 1, start: false}));
    }
  };

  const handlePrev = () => {
    if (walkThroughSteps > 1) {
      dispatch(setWalkThrough({steps: walkThroughSteps - 1, start: true}));
    }
  };

  const position: IPostiion = {
    card: {
      1: '10%',
      2: '72%',
      3: '72%',
    },
    arrow: {
      1: '9.5%',
      2: '89%',
      3: '88.5%',
    },
    left: {
      1: '7%',
      2: '4%',
      3: '84%',
    },
  };

  return (
    <Fragment>
      <AlertDialog
        isOpen={startWalkThrough}
        closeOnOverlayClick={false}
        size={'lg'}>
        <AlertDialogBackdrop />
        <AlertDialogContent
          bottom={'$1'}
          h={'$full'}
          bg={'transparent'}
          position={'relative'}>
          <View
            position={'absolute'}
            bottom={position.card[walkThroughSteps] as DimensionValue}
            w={'$full'}
            zIndex={1}
            bg={theme.colors.primary.white}>
            <AlertDialogBody mb={'$2'}>
              {walkThroughSteps === 1 && (
                <StepOne handlePrev={handlePrev} handleNext={handleNext} />
              )}
              {walkThroughSteps === 2 && (
                <StepTwo handlePrev={handlePrev} handleNext={handleNext} />
              )}
              {walkThroughSteps === 3 && (
                <StepThree handlePrev={handlePrev} handleNext={handleNext} />
              )}
            </AlertDialogBody>
          </View>
          <View
            h={'$10'}
            w={'$16'}
            bg={theme.colors.primary.white}
            position={'absolute'}
            bottom={position.arrow[walkThroughSteps] as DimensionValue}
            left={position.left[walkThroughSteps] as DimensionValue}
            transform={[{rotate: '-45deg'}]}
          />
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}
