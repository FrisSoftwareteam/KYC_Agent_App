import {AuthLayout} from '@/common/component/layout/auth-layout';
import {ERoutes} from '@/common/enum/routes';
import {TNavigation} from '@/common/types/navigation';
import {theme} from '@/providers/theme-provider';
import {
  Button,
  ButtonText,
  Center,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SafeAreaView,
  ScrollView,
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
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';

export function SignUp() {
  const {navigate} = useNavigation<TNavigation>();
  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title={'Create your account'}
      subtitle={'Enter your details to sign up as an agent'}>
      <SafeAreaView flex={1} bg={theme.colors.primary.white}>
        <ScrollView
          h={'$full'}
          w={'$full'}
          showsVerticalScrollIndicator={false}>
          <Center>
            <VStack space={'lg'} w={'90%'} h={'$full'} py={'$10'}>
              <VStack space={'sm'}>
                <Text
                  fontSize={'$sm'}
                  fontWeight={'$medium'}
                  fontFamily={theme.fontFamily.regular}
                  color={theme.colors.grey[200]}>
                  First Name
                </Text>
                <Input size={'xl'}>
                  <InputField
                    placeholder={'Enter your first name'}
                    placeholderTextColor={theme.colors.grey[300]}
                  />
                </Input>
              </VStack>

              <VStack space={'sm'}>
                <Text
                  fontSize={'$sm'}
                  fontWeight={'$medium'}
                  fontFamily={theme.fontFamily.regular}
                  color={theme.colors.grey[200]}>
                  Surname
                </Text>
                <Input size={'xl'}>
                  <InputField
                    placeholder={'Enter your surname'}
                    placeholderTextColor={theme.colors.grey[300]}
                  />
                </Input>
              </VStack>

              <VStack space={'sm'}>
                <Text
                  fontSize={'$sm'}
                  fontWeight={'$medium'}
                  fontFamily={theme.fontFamily.regular}
                  color={theme.colors.grey[200]}>
                  Phone Number
                </Text>
                <Input size={'xl'}>
                  <InputField
                    placeholder={'Enter your phone number'}
                    placeholderTextColor={theme.colors.grey[300]}
                  />
                </Input>
              </VStack>

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
                    placeholderTextColor={theme.colors.grey[300]}
                  />
                </Input>
              </VStack>

              <VStack space={'sm'}>
                <Text
                  fontSize={'$sm'}
                  fontWeight={'$medium'}
                  fontFamily={theme.fontFamily.regular}
                  color={theme.colors.grey[200]}>
                  State of Residence
                </Text>
                <Select>
                  <SelectTrigger variant="outline" size={'xl'}>
                    <SelectInput placeholder="Select your state of residence" />
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
                      <SelectItem label="UX Research" value="ux" />
                      <SelectItem label="Web Development" value="web" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>

              <VStack space={'sm'}>
                <Text
                  fontSize={'$sm'}
                  fontWeight={'$medium'}
                  fontFamily={theme.fontFamily.regular}
                  color={theme.colors.grey[200]}>
                  Create Password
                </Text>
                <Input size={'xl'}>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    placeholder={'Enter a password'}
                    placeholderTextColor={theme.colors.grey[300]}
                  />
                  <InputSlot pr="$3" onPress={handleState}>
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
                  Confirm Password
                </Text>
                <Input size={'xl'}>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    placeholder={'Confirm password'}
                    placeholderTextColor={theme.colors.grey[300]}
                  />
                  <InputSlot pr="$3" onPress={handleState}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      color={theme.colors.grey[200]}
                      size={'lg'}
                    />
                  </InputSlot>
                </Input>
              </VStack>

              <Text
                fontFamily={theme.fontFamily.medium}
                color={theme.colors.grey.solid}
                lineHeight={'$md'}>
                By clicking on create account, you agree to the{' '}
                <Text
                  color={theme.colors.primary.yellow}
                  onPress={() => navigate(ERoutes.LOGIN)}>
                  terms and conditions
                </Text>{' '}
                and{' '}
                <Text
                  color={theme.colors.primary.yellow}
                  onPress={() => navigate(ERoutes.LOGIN)}>
                  privacy policy
                </Text>
              </Text>

              <VStack space={'2xl'} mt={'$5'}>
                <Button
                  bg={theme.colors.primary.DEFAULT}
                  size={'lg'}
                  onPress={() => navigate(ERoutes.DASHBOARD)}>
                  <ButtonText>Create account</ButtonText>
                </Button>
                <Text
                  textAlign={'center'}
                  fontFamily={theme.fontFamily.medium}
                  color={theme.colors.grey.solid}>
                  Already an agent?{' '}
                  <Text
                    color={theme.colors.primary.DEFAULT}
                    onPress={() => navigate(ERoutes.LOGIN)}>
                    Login
                  </Text>
                </Text>
              </VStack>
            </VStack>
          </Center>
        </ScrollView>
      </SafeAreaView>
    </AuthLayout>
  );
}
