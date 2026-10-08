import {apiSlice} from '@/lib/redux/apislice';
import {apis} from './_apis-emum';
import {
  TAddress,
  TAddressInfo,
  TAddressStatus,
  TSubmitAddress,
  TTaskRequest,
  TTaskResponse,
  TUpload,
  TVerification,
} from '@/common/types/verification';
import {setInProgressData} from '@/features/dashboard/verification/new-verification/slice';

const VerificationApiFunction = apiSlice.injectEndpoints({
  endpoints: builder => ({
    verification: builder.query<TVerification, string>({
      query: credentials => ({
        url: `${apis.VERIFICATION}${credentials}`,
        method: 'GET',
      }),
      providesTags: ['Verification'],
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const parts = arg.split('=');
          const part = parts[1];
          const status = part.split('&');
          const {data} = await queryFulfilled;
          const persistData = data?.data.addresses.map(item => ({
            _id: item._id,
            candidate: item.candidate,
            category: item.category,
            formatAddress: item.formatAddress,
            createdAt: item.createdAt,
            status: item.status,
            googleMapUrl: item.googleMapUrl,
            position: item.position,
          }));

          if (status[0] === 'inprogress') {
            dispatch(setInProgressData(persistData));
          }
        } catch (err) {
          err;
        }
      },
    }),

    address: builder.query<TAddress, string>({
      query: credentials => ({
        url: `${apis.SINGLE_ADDRESS}${credentials}`,
        method: 'GET',
      }),
      providesTags: ['Verification'],
    }),

    acceptTask: builder.mutation<TTaskResponse, TTaskRequest>({
      query: credentials => ({
        url: apis.ACCEPT_TASK,
        method: 'POST',
        body: {...credentials},
      }),
      invalidatesTags: ['Verification', 'Metrics', 'Profile'],
    }),

    addressStatus: builder.mutation<any, TAddressStatus>({
      query: credentials => ({
        url: apis.UPDATE_ADDRESS_STATUS,
        method: 'PUT',
        body: {...credentials},
      }),
      invalidatesTags: ['Verification', 'Metrics', 'Profile'],
    }),

    submitAddress: builder.mutation<any, TSubmitAddress>({
      query: credentials => ({
        url: apis.SUBMIT_ADDESS,
        method: 'POST',
        body: {...credentials},
      }),
      invalidatesTags: ['Verification', 'Metrics', 'Profile'],
    }),

    updateAddressInfo: builder.mutation<any, TAddressInfo>({
      query: credentials => ({
        url: apis.UPDATE_ADDRESS,
        method: 'PUT',
        body: {...credentials},
      }),
      invalidatesTags: ['Verification', 'Metrics', 'Profile'],
    }),

    imageUpload: builder.mutation<TUpload, FormData>({
      query: credentials => ({
        url: apis.UPLOAD_IMAGE,
        method: 'POST',
        body: credentials,
      }),
    }),

    uploadSignature: builder.mutation<TUpload, FormData>({
      query: credentials => ({
        url: apis.UPLOAD_SIGNATURE,
        method: 'POST',
        body: credentials,
      }),
    }),

    uploadAudio: builder.mutation<TUpload, FormData>({
      query: credentials => ({
        url: apis.UPLOAD_AUDIO,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useVerificationQuery,
  useAddressQuery,
  useAcceptTaskMutation,
  useAddressStatusMutation,
  useImageUploadMutation,
  useUploadSignatureMutation,
  useUpdateAddressInfoMutation,
  useSubmitAddressMutation,
  useUploadAudioMutation,
} = VerificationApiFunction;
