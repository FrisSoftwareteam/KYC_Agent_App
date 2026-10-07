/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {AppProvider} from './src/providers/app-provider';
import {AppRouter} from './src/routes';

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
export default App;
