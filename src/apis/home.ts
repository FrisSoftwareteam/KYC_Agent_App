import {apiSlice} from '@/lib/redux/apislice';
import {apis} from './_apis-emum';
import {TMetrics, TTrending} from '@/common/types/home';

const HomeApiFunction = apiSlice.injectEndpoints({
  endpoints: builder => ({
    metrics: builder.query<TMetrics, any>({
      query: credentials => ({
        url: `${apis.METRICS}?period=${credentials}`,
        method: 'GET',
      }),
      providesTags: ['Metrics'],
    }),
    trending: builder.query<TTrending, any>({
      query: credentials => ({
        url: `${apis.TRENDING}?period=${credentials}`,
        method: 'GET',
      }),
      providesTags: ['Metrics'],
    }),
  }),
});

export const {useMetricsQuery, useTrendingQuery} = HomeApiFunction;
