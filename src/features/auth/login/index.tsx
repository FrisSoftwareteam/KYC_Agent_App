import {AuthLayout} from '@/common/component/layout/auth-layout';
// import {ERoutes} from '@/common/enum/routes';
import {useLogin} from '@/common/hooks/login';
import {theme} from '@/providers/theme-provider';
import {
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  HStack,
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
import {Image, TouchableOpacity} from 'react-native';
import clecheckLogo from '@/assets/images/brand/clecheck.png';
import frLogo from '@/assets/images/brand/first-registrars.png';

export function Login() {
  const {
    payload,
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
      title={'Welcome back'}
      subtitle={'Sign in to receive and complete verification jobs'}>
      <Center bg={theme.colors.primary.white}>
        <VStack space={'3xl'} w={'90%'} h={'$full'} pt={'$8'}>
          <Center>
            <Image
              source={clecheckLogo}
              style={{width: 120, height: 57, borderRadius: 10}}
              resizeMode={'contain'}
            />
            <HStack space={'xs'} alignItems={'center'} mt={'$2'}>
              <Text fontSize={'$xs'} color={theme.colors.grey[200]}>
                Powered by
              </Text>
              <Image
                source={frLogo}
                style={{width: 92, height: 32}}
                resizeMode={'contain'}
              />
            </HStack>
          </Center>
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
                returnKeyType="next"
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
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
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
                Forgot password?
              </Text>
            </TouchableOpacity>
          </VStack>

          <VStack space={'2xl'} mt={'$5'}>
            <Button
              bg={theme.colors.primary.DEFAULT}
              size={'lg'}
              onPress={handleSubmit}
              isDisabled={
                isLoading || !payload.email.trim() || !payload.password
              }>
              <ButtonText>Sign in</ButtonText>
              {isLoading && <ButtonSpinner ml="$1" />}
            </Button>
            <Text
              textAlign={'center'}
              fontFamily={theme.fontFamily.medium}
              color={theme.colors.grey.solid}>
              New agent? Ask your partner to add you, then sign in with the
              details they send you.
            </Text>
          </VStack>
        </VStack>
      </Center>
      <ForgetPasswordModal isOpen={isOpen} onClose={onClose} />
    </AuthLayout>
  );
}
