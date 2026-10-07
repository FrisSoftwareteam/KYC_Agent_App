import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type State = {
  data: null | {
    address: string;
    distance: string;
    candidate: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
    verificationId: string;
    addressId: string;
  };

  location: null | {
    coords: {
      accuracy: number;
      altitude: number;
      heading: number;
      latitude: number;
      longitude: number;
      speed: number;
    };
    extras: {verticalAccuracy: number};
    mocked: false;
    timestamp: number;
  };

  isOpen: boolean;
  permissionIsOpen: boolean;
  locationPermission: boolean;
  notificationPermission: boolean;
};

const initialState: State = {
  data: null,
  isOpen: false,
  notificationPermission: false,
  locationPermission: false,
  permissionIsOpen: false,
  location: null,
};

export const AblySlice = createSlice({
  name: 'ably',
  initialState: initialState,
  reducers: {
    setAbly: (state, action) => {
      state.data = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setAblyModal: (state, action) => {
      state.isOpen = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermission = action.payload;
    },
    setNotificationPermission: (state, action: PayloadAction<boolean>) => {
      state.notificationPermission = action.payload;
    },
    setpermissionIsOpen: (state, action: PayloadAction<boolean>) => {
      state.permissionIsOpen = action.payload;
    },
  },
});

export const {
  setAbly,
  setAblyModal,
  setLocation,
  setpermissionIsOpen,
  setNotificationPermission,
  setLocationPermission,
} = AblySlice.actions;
