import {AuthLayout} from '@/common/component/layout/auth-layout';
// import {ERoutes} from '@/common/enum/routes';
import {useLogin} from '@/common/hooks/login';
import {theme} from '@/providers/theme-provider';
import {
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {EyeIcon, EyeOffIcon} from 'lucide-react-native';
import React from 'react';
import {ForgetPasswordModal} from './forget-password-modal';
import {TouchableOpacity} from 'react-native';

export function Login() {
  const {
    // navigate,
    showPassword,
    isLoading,
    isOpen,
    handleChange,
    handleState,
    handleSubmit,
    onOpen,
    onClose,
  } = useLogin();
  return (
    <AuthLayout
      title={'Login to your account'}
      subtitle={' Enter your details to login to your account'}>
      <Center bg={theme.colors.primary.white}>
        <VStack space={'4xl'} w={'90%'} h={'$full'} pt={'$10'}>
          <VStack space={'sm'}>
            <Text
              fontSize={'$sm'}
              fontWeight={'$medium'}
              fontFamily={theme.fontFamily.regular}
              color={theme.colors.grey[200]}>
              Email Address
            </Text>
            <Input size={'xl'}>
              <InputField
                placeholder={'Enter your email address'}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                placeholderTextColor={theme.colors.grey[300]}
                onChangeText={e => handleChange(e, 'email')}
              />
            </Input>
          </VStack>

          <VStack space={'sm'}>
            <Text
              fontSize={'$sm'}
              fontWeight={'$medium'}
              fontFamily={theme.fontFamily.regular}
              color={theme.colors.grey[200]}>
              Password
            </Text>
            <Input>
              <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder={'Enter your password'}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={theme.colors.grey[300]}
                onChangeText={e => handleChange(e, 'password')}
              />
              <InputSlot pr="$3" onPress={handleState}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  color={theme.colors.grey[200]}
                  size={'lg'}
                />
              </InputSlot>
            </Input>
            <TouchableOpacity onPress={onOpen}>
              <Text
                fontSize={'$sm'}
                fontWeight={'$medium'}
                fontFamily={theme.fontFamily.bold}
                color={theme.colors.primary.DEFAULT}>
                Forget Password?
              </Text>
            </TouchableOpacity>
          </VStack>

          <VStack space={'2xl'} mt={'$5'}>
            <Button
              bg={theme.colors.primary.DEFAULT}
              size={'lg'}
              onPress={handleSubmit}
              isDisabled={isLoading}>
              <ButtonText>Login</ButtonText>
              {isLoading && <ButtonSpinner ml="$1" />}
            </Button>
            <Text
              textAlign={'center'}
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey.solid}>
              Don’t have an account?{' '}
              <Text
                color={theme.colors.primary.DEFAULT}
                // onPress={() => navigate(ERoutes.SIGN_UP)}
              >
                Create account
              </Text>
            </Text>
          </VStack>
        </VStack>
      </Center>
      <ForgetPasswordModal isOpen={isOpen} onClose={onClose} />
    </AuthLayout>
  );
}
