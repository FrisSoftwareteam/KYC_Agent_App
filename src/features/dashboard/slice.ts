import {createSlice} from '@reduxjs/toolkit';

type State = {
  addressId: string | null;
};

const initialState: State = {
  addressId: null,
};

export const DashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    setAddressID: (state, action) => {
      state.addressId = action.payload;
    },
  },
});

export const {setAddressID} = DashboardSlice.actions;
