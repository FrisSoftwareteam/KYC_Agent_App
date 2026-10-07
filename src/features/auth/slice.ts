import {PayloadAction, createSlice} from '@reduxjs/toolkit';

type State = {
  user: null | {id: string; agentId: string};
  accessToken: string | null;
  refreshToken: string | null;
  status: 'online' | 'offline';
  walkThroughSteps: number;
  startWalkThrough: boolean;
};

const initialState: State = {
  user: null,
  refreshToken: null,
  accessToken: null,
  status: 'online',
  walkThroughSteps: 0,
  startWalkThrough: false,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      const {user, jwt} = action.payload.data;
      state.user = user;
      state.refreshToken = jwt.refreshToken;
      state.accessToken = jwt.accessToken;
    },
    setStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.status = action.payload;
    },
    setWalkThrough: (
      state,
      action: PayloadAction<{steps: number; start: boolean}>,
    ) => {
      const {steps, start} = action.payload;
      state.startWalkThrough = start;
      state.walkThroughSteps = steps;
    },
    logOut: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.status = 'offline';
    },
  },
});

export const {setUser, setStatus, setWalkThrough, logOut} = AuthSlice.actions;
