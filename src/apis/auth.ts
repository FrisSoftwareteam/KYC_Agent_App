import {apiSlice} from '@/lib/redux/apislice';
import {apis} from './_apis-emum';
import {
  TLoginRequest,
  LoginResponse,
  TSyncLocationRequest,
  TProfile,
  TChangePasswordRequest,
} from '@/common/types/login';
import {TUpload} from '@/common/types/verification';

const AuthApiFunction = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, TLoginRequest>({
      query: credentials => ({
        url: apis.LOGIN,
        method: 'POST',
        body: {...credentials},
      }),
    }),

    fcmToken: builder.mutation<any, {token: string}>({
      query: credentials => ({
        url: apis.FCM_TOKEN,
        method: 'POST',
        body: {...credentials},
      }),
    }),

    syncLocation: builder.mutation<any, TSyncLocationRequest>({
      query: credentials => ({
        url: apis.SYNC_LOCATION,
        method: 'POST',
        body: {...credentials},
      }),
    }),

    profile: builder.query<TProfile, void | string>({
      query: () => ({
        url: apis.PROFILE,
        method: 'GET',
      }),
      keepUnusedDataFor: 60,
      providesTags: ['Profile'],
    }),

    changePassword: builder.mutation<any, TChangePasswordRequest>({
      query: credentials => ({
        url: apis.CHANGE_PASSWORD,
        method: 'PUT',
        body: {...credentials},
      }),
    }),

    uploadProfilePicture: builder.mutation<TUpload, FormData>({
      query: credentials => ({
        url: apis.DISPLAY_PICTURE,
        method: 'PUT',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useProfileQuery,
  useLoginMutation,
  useFcmTokenMutation,
  useSyncLocationMutation,
  useChangePasswordMutation,
  useUploadProfilePictureMutation,
} = AuthApiFunction;
