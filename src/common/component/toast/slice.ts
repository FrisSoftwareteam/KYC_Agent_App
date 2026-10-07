import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type ToastType = 'success' | 'default' | 'error';

type State = {
  description: string | null;
  title: string | null;
  type: ToastType | null;
};

type ToastPayload = {
  description: any | null;
  title?: any;
  type: ToastType | null;
};

const initialState: State = {
  description: null,
  title: null,
  type: 'default',
};

export const ToastSlice = createSlice({
  name: 'toast',
  initialState: initialState,
  reducers: {
    setToast: (state, action: PayloadAction<ToastPayload>) => {
      const {description, title, type} = action.payload;
      state.description = description;
      state.title = title;
      state.type = type;
    },
  },
});

export const {setToast} = ToastSlice.actions;
