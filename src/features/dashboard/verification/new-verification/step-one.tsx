import {RadioButton} from '@/common/component/ui/radio-button';
import {theme} from '@/providers/theme-provider';
import {
  ChevronDownIcon,
  HStack,
  Icon,
  Input,
  InputField,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import React from 'react';
import {Motion} from '@legendapp/motion';
import {Easing} from 'react-native';
import {buildingTypes, gatePresents} from './data';

type TQuestion = {
  payload: any;
  handleChange: any;
};

export function StepOne({payload, handleChange}: TQuestion) {
  const showBuildingColor =
    payload.gatePresent === 'False' ||
    (payload.gatePresent === 'True' && payload.gateColor);

  return (
    <View>
      <Text
        color={theme.colors.primary.DEFAULT}
        fontFamily={theme.fontFamily.medium}
        fontSize={'$lg'}>
        Address Information
      </Text>
      <VStack space={'4xl'} mt={'$4'}>
        <CustomSelect
          label={'What type of building is it?'}
          payload={payload.buildingType}
          onPress={(e: any) => handleChange(e, 'buildingType')}
          data={buildingTypes}
        />
        {payload.buildingType && (
          <CustomRadio
            label={'Is the building gated?'}
            payload={payload.gatePresent}
            onPress={handleChange}
            data={gatePresents}
          />
        )}
        {payload.gatePresent === 'True' && (
          <CustomInput
            label={'What is the building gate color?'}
            payload={payload.gateColor}
            onPress={(e: any) => handleChange(e, 'gateColor')}
          />
        )}
        {showBuildingColor && (
          <CustomInput
            label={'What is the building color?'}
            payload={payload.buildingColor}
            onPress={(e: any) => handleChange(e, 'buildingColor')}
          />
        )}
        {payload.buildingColor && (
          <CustomInput
            label={'What is the closet landmark to the building?'}
            payload={payload.closestLandmark}
            onPress={(e: any) => handleChange(e, 'closestLandmark')}
          />
        )}
      </VStack>
    </View>
  );
}

function CustomLabel({label}: {label: string}) {
  return (
    <Text
      color={theme.colors.grey[200]}
      fontFamily={theme.fontFamily.medium}
      fontWeight={'$medium'}
      fontSize={'$lg'}
      mb={'$3'}>
      {label}
    </Text>
  );
}

function CustomInput({label, payload, onPress}: any) {
  return (
    <Motion.View
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{
        type: 'timing',
        duration: 500,
        easing: Easing.in(Easing.ease),
      }}>
      <CustomLabel label={label} />
      <Input size={'xl'}>
        <InputField
          placeholder={'Enter the details'}
          placeholderTextColor={theme.colors.grey[300]}
          value={payload}
          onChangeText={onPress}
        />
      </Input>
    </Motion.View>
  );
}

function CustomSelect({label, data, payload, onPress}: any) {
  return (
    <Motion.View
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{
        type: 'tween',
        duration: 500,
        easing: Easing.in(Easing.ease),
      }}>
      <CustomLabel label={label} />

      <Select onValueChange={onPress} defaultValue={payload}>
        <SelectTrigger variant="outline" size={'xl'}>
          <SelectInput placeholder={'--Select a reason'} />
          <View mr={'$3'} mt={'$2'}>
            <SelectIcon>
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </View>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {data.map((item: any) => (
              <SelectItem label={item.value} value={item.value} key={item.id} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </Motion.View>
  );
}

function CustomRadio({label, data, payload, onPress}: any) {
  return (
    <Motion.View
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{
        type: 'timing',
        duration: 500,
        easing: Easing.in(Easing.ease),
      }}>
      <CustomLabel label={label} />
      <HStack space={'md'} w={'$full'}>
        {data.map((item: any) => (
          <RadioButton
            value={item.value}
            key={item.id}
            payload={payload}
            onPress={() => onPress(item.value, 'gatePresent')}
          />
        ))}
      </HStack>
    </Motion.View>
  );
}
