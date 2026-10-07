import React from 'react';
import {ERoutes} from '@/common/enum/routes';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteScreenOptions} from '@/common/component/navigation';
import {Home} from '../home';
import {Profile} from '../profile';
import Verification from '../verification';

export default function DashboardRoute() {
  const Stack = createBottomTabNavigator();
  return (
    <Stack.Navigator initialRouteName={ERoutes.HOME}>
      <Stack.Screen
        name={ERoutes.HOME}
        component={Home}
        options={RouteScreenOptions}
      />
      <Stack.Screen
        name={ERoutes.VERIFICATION}
        component={Verification}
        options={RouteScreenOptions}
      />
      <Stack.Screen
        name={ERoutes.PROFILE}
        component={Profile}
        options={RouteScreenOptions}
      />
    </Stack.Navigator>
  );
}
