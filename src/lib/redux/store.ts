import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {AppState} from 'react-native';
import {apiSlice} from './apislice';
import {rootReducer} from './reducers';
import {persistReducer, persistStore} from 'redux-persist';
import {createRealmPersistStorage} from '../realm';

const persistConfig = {
  key: 'root',
  storage: createRealmPersistStorage(),
  whitelist: ['auth', 'offline'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }).concat(apiSlice.middleware);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: middleware,
  //   devTools: 'development',
});

export const persistor = persistStore(store);

// React Native has no browser focus events, so tell RTK Query when the app
// comes back to the foreground. Together with refetchOnFocus this reloads
// the dashboard, lists and profile whenever the agent reopens the app.
setupListeners(store.dispatch, (dispatch, {onFocus, onFocusLost}) => {
  const sub = AppState.addEventListener('change', state => {
    if (state === 'active') {
      dispatch(onFocus());
    } else {
      dispatch(onFocusLost());
    }
  });
  return () => sub.remove();
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
