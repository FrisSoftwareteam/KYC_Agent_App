import {theme} from '@/providers/theme-provider';
import {
  Center,
  HStack,
  VStack,
  View,
  StatusBar,
  SafeAreaView,
  Button,
  Text,
} from '@gluestack-ui/themed';
import {MoveLeft} from 'lucide-react-native';
import React, {PropsWithChildren} from 'react';
import {CustomLinear} from '../ui/linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {TNavigation} from '@/common/types/navigation';
import {ERoutes} from '@/common/enum/routes';

type TAuthLayout = {
  title: string;
  subtitle: string;
};

export function AuthLayout({
  title,
  subtitle,
  children,
}: TAuthLayout & PropsWithChildren) {
  const {navigate} = useNavigation<TNavigation>();
  return (
    <View bg={theme.colors.primary.DEFAULT} flex={1}>
      <StatusBar
        animated={true}
        backgroundColor={theme.colors.primary.DEFAULT}
        hidden={false}
      />
      <SafeAreaView>
        <CustomLinear
          h={'$5'}
          w={'$32'}
          colors={['#CCA047', '#11406F']}
          start={{x: 0, y: 0} as any}
          end={{x: 1, y: 1} as any}
        />
        <Center w={'$full'} h={'auto'}>
          <HStack
            h={'auto'}
            w={'90%'}
            overflow={'hidden'}
            py={'$5'}
            alignItems={'flex-start'}
            position={'relative'}>
            <Button
              position={'absolute'}
              top={'$3'}
              zIndex={1}
              variant={'link'}
              onPress={() => navigate(ERoutes.AUTH)}>
              <MoveLeft color={theme.colors.primary.white} />
            </Button>
            <View w={'$full'}>
              <Text
                color={theme.colors.primary.white}
                fontWeight={'$medium'}
                fontSize={'$xl'}
                fontFamily={'Ubuntu-Bold'}
                textAlign={'center'}>
                {title}
              </Text>
              <Text
                color={theme.colors.primary.white}
                fontFamily={'Ubuntu-Regular'}
                textAlign={'center'}>
                {subtitle}
              </Text>
            </View>
          </HStack>
        </Center>
        <VStack justifyContent={'flex-end'} w={'$full'} alignItems={'flex-end'}>
          <CustomLinear
            h={'$5'}
            w={'$32'}
            colors={['#11406F', '#CCA047']}
            start={{x: 0, y: 0} as any}
            end={{x: 1, y: 1} as any}
          />
        </VStack>
      </SafeAreaView>
      {children}
    </View>
  );
}
