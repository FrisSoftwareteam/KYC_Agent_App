import {PayloadAction, createSlice} from '@reduxjs/toolkit';

type State = {
  data: Array<any>;
  isInitialized: boolean;
  isSyncing: boolean;
  inprogress: Array<{
    _id: string;
    candidate: any;
    category: string;
    formatAddress: string;
    createdAt: string;
    status: string;
    googleMapUrl: string;
    position: any;
  }>;
};

type TPayload = {
  data: any;
  isInitialized: boolean;
};

const initialState: State = {
  data: [],
  isInitialized: false,
  isSyncing: false,
  inprogress: [],
};

export const OfflineSlice = createSlice({
  name: 'offline',
  initialState: initialState,
  reducers: {
    setOfflineData: (state, action: PayloadAction<TPayload>) => {
      const {data, isInitialized} = action.payload;
      state.isInitialized = isInitialized;
      const index = state.data.findIndex((item: any) => item._id === data._id);
      if (index >= 0) {
        state.data[index] = data;
      } else {
        state.data.push(data);
      }
    },
    setUpdatedOfflineData: (state, action: PayloadAction<TPayload>) => {
      const {data, isInitialized} = action.payload;
      state.isInitialized = isInitialized;
      const idx = state.data.findIndex((item: any) => item._id === data);
      if (idx !== -1) {
        state.data.splice(idx, 1);
      }
    },
    setInProgressData: (state, action) => {
      state.inprogress = action.payload;
    },
    setIsSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
  },
});

export const {
  setOfflineData,
  setInProgressData,
  setUpdatedOfflineData,
  setIsSyncing,
} = OfflineSlice.actions;
