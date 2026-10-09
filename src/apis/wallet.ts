import {apiSlice} from '@/lib/redux/apislice';
import {apis} from './_apis-emum';

export type TBank = {name: string; code: string; active?: boolean};

export type TWalletTransaction = {
  _id: string;
  amount: number | string;
  status: string;
  type: string;
  reference: string;
  createdAt: string;
};

const WalletApiFunction = apiSlice.injectEndpoints({
  endpoints: builder => ({
    banks: builder.query<{data: TBank[]}, void>({
      query: () => ({url: apis.BANKS, method: 'GET'}),
      keepUnusedDataFor: 3600,
    }),

    walletTransactions: builder.query<
      {data: {meta: any; transactions: TWalletTransaction[]}},
      number | void
    >({
      query: (page = 1) => ({
        url: `${apis.WITHDRAWALS}?page=${page}&size=30`,
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),

    resolveAccount: builder.mutation<
      {data: {accountName: string}},
      {accountNumber: string; bankCode: string}
    >({
      query: body => ({url: apis.RESOLVE_ACCOUNT, method: 'POST', body}),
    }),

    upsertBank: builder.mutation<
      {data: string},
      {accountNumber: string; bankCode: string}
    >({
      query: body => ({url: apis.UPSERT_BANK, method: 'POST', body}),
      invalidatesTags: ['Profile'],
    }),

    withdrawFund: builder.mutation<{data: string}, {amount: number}>({
      query: body => ({url: apis.WITHDRAW_FUND, method: 'POST', body}),
      invalidatesTags: ['Profile', 'Wallet'],
    }),
  }),
});

export const {
  useBanksQuery,
  useWalletTransactionsQuery,
  useResolveAccountMutation,
  useUpsertBankMutation,
  useWithdrawFundMutation,
} = WalletApiFunction;
