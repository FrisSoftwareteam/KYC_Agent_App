import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SignUp} from '../sign-up';
import {Login} from '../login';
import {Auth} from '..';
import {ERoutes} from '@/common/enum/routes';

export default function AuthRoute() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="auth-index">
      <Stack.Screen
        name={ERoutes.AUTH}
        component={Auth}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ERoutes.SIGN_UP}
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ERoutes.LOGIN}
        component={Login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
