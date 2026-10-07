import React from 'react';
import {ERoutes} from '@/common/enum/routes';
import {Icon, Text} from '@gluestack-ui/themed';
import {theme} from '@/providers/theme-provider';
import {CircleUser, LayoutDashboard, ShieldCheck} from 'lucide-react-native';

function getTabLabel(routeName: ERoutes) {
  if (routeName === ERoutes.HOME) {
    return {name: 'Dashboard', icon: LayoutDashboard};
  } else if (routeName === ERoutes.VERIFICATION) {
    return {name: ERoutes.VERIFICATION, icon: ShieldCheck};
  } else if (routeName === ERoutes.PROFILE) {
    return {name: ERoutes.PROFILE, icon: CircleUser};
  } else {
    return routeName;
  }
}

export function RouteScreenOptions({route}: any) {
  const {name, icon}: any = getTabLabel(route.name);

  return {
    headerShown: false,
    tabBarLabel: ({focused}: any) => (
      <Text
        color={focused ? theme.colors.primary.DEFAULT : theme.colors.grey[200]}
        fontWeight="700"
        textTransform={'capitalize'}
        fontSize={'$md'}
        fontFamily={theme.fontFamily.medium}>
        {name}
      </Text>
    ),
    tabBarIcon: ({focused}: any) => (
      <Icon
        as={icon}
        size={'xl'}
        color={focused ? theme.colors.primary.DEFAULT : theme.colors.grey[200]}
      />
    ),
    tabBarStyle: {
      paddingTop: 10,
      paddingBottom: 15,
      height: 80,
    },
  };
}
