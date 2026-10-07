import {configureStore} from '@reduxjs/toolkit';
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

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
