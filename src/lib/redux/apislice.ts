// @ts-nocheck
import {QueryReturnValue} from 'node_modules/@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  FetchArgs,
  fetchBaseQuery,
  createApi,
  BaseQueryApi,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import {store} from './store';
import {logOut, setUser} from '@/features/auth/slice';
import {apis} from '@/apis/_apis-emum';
import {setToast} from '@/common/component/toast/slice';
import Config from 'react-native-config';

interface ExtraOptions {
  signal?: AbortSignal;
}

const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
  credentials: 'same-origin',
});

const baseQueryWithHeaders = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: ExtraOptions,
): Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
> => {
  const {accessToken, refreshToken} = store.getState().auth;

  let result = await baseQuery(
    {
      ...args,
      headers: {
        ...args.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    },
    api,
    extraOptions,
  );

  if ([401, 520].includes(result.error?.status as number)) {
    const refreshResult: any = await baseQuery(
      {
        url: apis.REFRESH_TOKEN,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const nweRefreshToken = refreshResult.data;

      api.dispatch(setUser({data: nweRefreshToken.data}));
      result = await baseQuery(
        {
          ...args,
          headers: {
            ...args.headers,
            Authorization: `Bearer ${nweRefreshToken?.data?.accessToken}`,
          },
        },
        api,
        extraOptions,
      );
    } else {
      api.dispatch(logOut());
    }
  } else if (result.error) {
    api.dispatch(setToast({description: result.error, type: 'error'}));
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithHeaders,
  tagTypes: ['Verification', 'Metrics', 'Profile'],
  endpoints: () => ({}),
  refetchOnReconnect: true,
  refetchOnFocus: true,
  keepUnusedDataFor: 5,
  refetchOnMountOrArgChange: true,
});
