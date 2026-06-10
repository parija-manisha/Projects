import { configureStore } from '@reduxjs/toolkit';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import { CONFIG } from "../config";
import authReducer from './slices/authSlice';

const baseQueryFactory = fetchBaseQuery({
  baseUrl: CONFIG.SMART_SURVEY_BUILDER_API_BASE_URL,
  credentials: 'include',
  paramsSerializer: (params) => {
    const serializedParams = transformUrlParams(params);
    return serializedParams.toString();
  },
});

const baseQueryAuthFactory: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryFactory(args, api, extraOptions);

  if (!isValidBaseQueryResult(result)) {
    return { ...result, data: null, error: undefined };
  }

  return result;
};

const isValidBaseQueryResult = (result: QueryReturnValue): boolean =>
  !!result?.data || !!result?.error;

const transformUrlParams = (params: object): URLSearchParams | string => {
  //  Check needed for backward compatibility
  if (typeof params === 'string') {
    return params;
  }
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((arrayValue) => query.append(key, arrayValue));
    } else if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  return query;
};

export const BFF_API_REDUCER_KEY = 'bffApi';
export const bffApi = createApi({
  reducerPath: BFF_API_REDUCER_KEY,
  baseQuery: baseQueryAuthFactory,
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [BFF_API_REDUCER_KEY]: bffApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bffApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;