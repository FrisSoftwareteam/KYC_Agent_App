import {dateData} from '@/features/dashboard/home/data';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ERoutes} from '../enum/routes';
import {TNavigation} from '../types/navigation';
import {useMetricsQuery, useTrendingQuery} from '@/apis/home';
import {useAppDispatch, useAppSelector} from './redux';
import {setStatus} from '@/features/auth/slice';
import {useProfileQuery} from '@/apis/auth';
import {useOnRefresh} from './onrefresh';
import {setAddressID} from '@/features/dashboard/slice';
import {useNetInfo} from '@react-native-community/netinfo';

export const useHome = () => {
  const dispatch = useAppDispatch();
  const {isInternetReachable} = useNetInfo();
  const {status} = useAppSelector(state => state.auth);
  const [filter, setFilter] = useState(dateData[0].value);
  const {navigate} = useNavigation<TNavigation>();
  const period = filter !== 'today' ? `${filter}` : '';
  const {
    data: metricsData,
    isFetching,
    refetch,
  } = useMetricsQuery(period, {skip: !isInternetReachable});
  const {
    data: trendingData,
    isFetching: trendingIsLoading,
    refetch: trendingRefectch,
  } = useTrendingQuery(period, {skip: !isInternetReachable});
  const {data: profileData} = useProfileQuery('', {
    skip: !isInternetReachable,
  });
  const {refreshing, onRefresh} = useOnRefresh();
  const handleClick = (x: any) => {
    dispatch(setAddressID(x));
    navigate(ERoutes.VERIFICATION);
  };

  const handleStatus = (e: Boolean) => {
    const state = e ? 'online' : 'offline';
    dispatch(setStatus(state));
  };

  useEffect(() => {
    if (refreshing) {
      refetch();
      trendingRefectch();
    }
  }, [refetch, refreshing, trendingRefectch]);

  return {
    metricsData,
    trendingData: trendingData?.data,
    profileData: profileData?.data,
    filter,
    isLoading: isFetching && trendingIsLoading,
    setFilter,
    handleClick,
    handleStatus,
    navigate,
    status,
    refreshing,
    onRefresh,
  };
};
