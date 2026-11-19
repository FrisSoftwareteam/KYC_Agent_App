import {apiSlice} from '@/lib/redux/apislice';

// The onsite KYC form of a Credit and Loans KYC visit (items 1-35).
// The questions come from the server, so the app shows exactly what the server checks.

export type TOnsiteFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'yesno'
  | 'location'
  | 'files'
  | 'signature'
  | 'group';

export type TOnsiteField = {
  key: string;
  label: string;
  type: TOnsiteFieldType;
  required?: boolean;
  help?: string;
  options?: string[];
  kind?: 'photo' | 'video' | 'media' | 'document' | 'audio';
  min?: number;
  max?: number;
  digits?: number;
  nin?: boolean;
  fields?: TOnsiteField[];
  item?: string;
};

export type TOnsiteSection = {
  key: string;
  title: string;
  help?: string;
  fields: TOnsiteField[];
};

export type TOnsiteForm = {
  applies: boolean;
  // false: the form can be skipped for now (the server switch is off).
  required?: boolean;
  addressId?: string;
  definition?: TOnsiteSection[];
  prefill?: Record<string, any>;
  answers?: Record<string, any>;
  checks?: {
    nin?: Record<string, {status: string; recordName?: string}>;
    geotag?: Record<string, {metres: number; status: string}>;
  };
  missing?: string[];
  updatedAt?: string | null;
  submittedAt?: string | null;
};

const path = 'agents/credit-loans/onsite-form/';

const OnsiteFormApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    onsiteForm: builder.query<{data: TOnsiteForm}, string>({
      query: addressId => ({url: `${path}${addressId}`, method: 'GET'}),
      keepUnusedDataFor: 0,
    }),
    saveOnsiteForm: builder.mutation<
      {data: TOnsiteForm},
      {addressId: string; answers: Record<string, any>}
    >({
      query: ({addressId, answers}) => ({
        url: `${path}${addressId}`,
        method: 'PUT',
        body: {answers},
      }),
    }),
  }),
});

export const {useOnsiteFormQuery, useSaveOnsiteFormMutation} = OnsiteFormApi;
