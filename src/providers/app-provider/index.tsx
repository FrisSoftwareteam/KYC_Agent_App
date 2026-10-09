import React, {PropsWithChildren} from 'react';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {persistor, store} from '@/lib/redux/store';
import {ToastProvider} from '@/common/component/toast';
import {AblyModal} from '@/common/component/modal/ably-modal';
import {PersistGate} from 'redux-persist/integration/react';
import {SyncModal} from '@/common/component/modal/sync-modal';
import {PermissionModal} from '@/common/component/modal/permission-modal';
import {WalkThroughModal} from '@/common/component/modal/walk-through-modal';
import {StepFour as VerificationWalkThroughSheet} from '@/common/component/modal/walk-through-modal/step-four';

export function AppProvider({children}: PropsWithChildren) {
  // useNotifee();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GluestackUIProvider config={config}>
          <GestureHandlerRootView style={{flex: 1}}>
            {/* Android 15+ draws apps behind the status and navigation bars.
                This keeps every screen clear of them; on older phones the
                insets are zero, so nothing changes there. */}
            <SafeAreaProvider>
              <SafeAreaView
                style={{flex: 1, backgroundColor: '#FFFFFF'}}
                edges={['top', 'bottom']}>
                <NavigationContainer>
                  <ToastProvider />
                  {children}
                  <VerificationWalkThroughSheet />
                  <WalkThroughModal />
                  <SyncModal />
                  <AblyModal />
                  <PermissionModal />
                </NavigationContainer>
              </SafeAreaView>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}
