import React, {Fragment} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthRoute from '@/features/auth/route';
import DashboardRoute from '@/features/dashboard/route';
import {ERoutes} from '@/common/enum/routes';
import {Notification} from '@/features/dashboard/notification';
import {ChangePassword} from '@/features/auth/change-password';
import {EditProfile} from '@/features/dashboard/profile/edit-profile';
import {NewVerification} from '@/features/dashboard/verification/new-verification';
import {useInitiated} from '@/common/hooks/initiated';
import {Wallet} from '@/features/dashboard/wallet';

export const AppRouter = () => {
  const RoutesStack = createNativeStackNavigator();
  const {accessToken} = useInitiated();

  return (
    <RoutesStack.Navigator>
      {accessToken ? (
        <Fragment>
          <RoutesStack.Screen
            name={ERoutes.DASHBOARD}
            component={DashboardRoute}
            options={{headerShown: false}}
          />
          <RoutesStack.Screen
            name={ERoutes.NOTIFICATION}
            component={Notification}
            options={{headerShown: false}}
          />
          <RoutesStack.Screen
            name={ERoutes.EDIT_PROFILE}
            component={EditProfile}
            options={{headerShown: false}}
          />
          <RoutesStack.Screen
            name={ERoutes.CHANGE_PASSWORD}
            component={ChangePassword}
            options={{headerShown: false}}
          />
          <RoutesStack.Screen
            name={ERoutes.NEW_VERIFICATION}
            component={NewVerification}
            options={{headerShown: false}}
          />
          <RoutesStack.Screen
            name={ERoutes.WALLET}
            component={Wallet}
            options={{headerShown: false}}
          />
        </Fragment>
      ) : (
        <RoutesStack.Screen
          name="auth"
          component={AuthRoute}
          options={{headerShown: false}}
        />
      )}
    </RoutesStack.Navigator>
  );
};
