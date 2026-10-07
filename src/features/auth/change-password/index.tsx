import React from 'react';
import {theme} from '@/providers/theme-provider';
import {
  Center,
  View,
  StatusBar,
  SafeAreaView,
  Text,
  EyeIcon,
  EyeOffIcon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  VStack,
  Button,
  ButtonText,
  ButtonSpinner,
} from '@gluestack-ui/themed';
import {Header} from './header';
import {useChangePassword} from '@/common/hooks/change-password';

export function ChangePassword() {
  const {
    showPassword,
    showConfirmPassword,
    isLoading,
    payload,
    setShowConfirmPassword,
    setShowPassword,
    handleSave,
    validatePayload,
    handleChange,
  } = useChangePassword();

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
            <VStack space={'sm'}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey[200]}>
                Old Password
              </Text>
              <Input size={'xl'}>
                <InputField
                  type={'text'}
                  placeholder={'Enter your old password'}
                  placeholderTextColor={theme.colors.grey[300]}
                  onChangeText={e => handleChange(e, 'oldPassword')}
                  value={payload.oldPassword}
                />
              </Input>
            </VStack>

            <VStack space={'sm'}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey[200]}>
                New Password
              </Text>
              <Input size={'xl'}>
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  placeholder={'Enter your new password'}
                  placeholderTextColor={theme.colors.grey[300]}
                  onChangeText={e => handleChange(e, 'password')}
                  value={payload.password}
                />
                <InputSlot
                  pr="$3"
                  onPress={() => setShowPassword(!showPassword)}>
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    color={theme.colors.grey[200]}
                    size={'lg'}
                  />
                </InputSlot>
              </Input>
            </VStack>

            <VStack space={'sm'}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.regular}
                color={theme.colors.grey[200]}>
                Confirm New Password
              </Text>
              <Input size={'xl'}>
                <InputField
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={'Confirm new passowrd'}
                  placeholderTextColor={theme.colors.grey[300]}
                  onChangeText={e => handleChange(e, 'confirmPassword')}
                  value={payload.confirmPassword}
                />
                <InputSlot
                  pr="$3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <InputIcon
                    as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                    color={theme.colors.grey[200]}
                    size={'lg'}
                  />
                </InputSlot>
              </Input>
            </VStack>

            <Button
              bg={theme.colors.primary.DEFAULT}
              size={'lg'}
              mt={'$2'}
              isDisabled={!isLoading ? !validatePayload() : isLoading}
              onPress={handleSave}>
              <ButtonText>Save Changes</ButtonText>
              {isLoading && <ButtonSpinner ml="$1" />}
            </Button>
          </VStack>
        </Center>
      </SafeAreaView>
    </View>
  );
}
