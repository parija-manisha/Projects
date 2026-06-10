import { bffApi } from '../../../store/store';
import { AUTH_API_ENDPOINTS } from '../constants/authConstants';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/authTypes';

const authApiWithEndpoints = bffApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: AUTH_API_ENDPOINTS.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: AUTH_API_ENDPOINTS.REGISTER,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: AUTH_API_ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, string>({
      query: (refreshToken) => ({
        url: AUTH_API_ENDPOINTS.REFRESH,
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    validateToken: builder.query<{ message: string }, void>({
      query: () => ({
        url: AUTH_API_ENDPOINTS.VALIDATE,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: true,
});

export const authApi = authApiWithEndpoints;

// Export hooks - RTK Query generates these dynamically
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useRefreshTokenMutation, useValidateTokenQuery } = authApiWithEndpoints as any;





