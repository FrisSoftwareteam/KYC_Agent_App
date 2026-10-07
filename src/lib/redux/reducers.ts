import {combineReducers} from '@reduxjs/toolkit';
import {apiSlice} from './apislice';
import {ToastSlice} from '@/common/component/toast/slice';
import {AblySlice} from '../ably/slice';
import {AuthSlice} from '@/features/auth/slice';
import {DashboardSlice} from '@/features/dashboard/slice';
import {OfflineSlice} from '@/features/dashboard/verification/new-verification/slice';

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  ably: AblySlice.reducer,
  auth: AuthSlice.reducer,
  dasshboard: DashboardSlice.reducer,
  toast: ToastSlice.reducer,
  offline: OfflineSlice.reducer,
});
