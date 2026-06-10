import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../modules/auth/types/authTypes';
import { AUTH_STORAGE_KEYS } from '../../modules/auth/constants/authConstants';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    },
    loginSuccess: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, action.payload.token);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setUser,
  setToken,
  clearAuth,
  loginSuccess,
  loginFailure,
} = authSlice.actions;

export default authSlice.reducer;
