import {safeRefetch} from '@/utils/safe-refetch';
import {dateData} from '@/features/dashboard/home/data';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {ERoutes} from '../enum/routes';
import {TNavigation} from '../types/navigation';
import {useMetricsQuery, useTrendingQuery} from '@/apis/home';
import {useAppDispatch, useAppSelector} from './redux';
import {setStatus} from '@/features/auth/slice';
import {useProfileQuery} from '@/apis/auth';
import {useOnRefresh} from './onrefresh';
import {setAddressID} from '@/features/dashboard/slice';
import {useIsOnline} from '@/common/hooks/online';

export const useHome = () => {
  const dispatch = useAppDispatch();
  const isInternetReachable = useIsOnline();
  const {status} = useAppSelector(state => state.auth);
  const [filter, setFilter] = useState(dateData[0].value);
  const {navigate} = useNavigation<TNavigation>();
  const period = filter !== 'today' ? `${filter}` : '';
  const {
    data: metricsData,
    isFetching,
    refetch,
  } = useMetricsQuery(period, {
    skip: !isInternetReachable,
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: trendingData,
    isFetching: trendingIsLoading,
    refetch: trendingRefectch,
  } = useTrendingQuery(period, {
    skip: !isInternetReachable,
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });
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

  // Fresh numbers every time the home screen is opened again.
  useFocusEffect(
    useCallback(() => {
      if (isInternetReachable) {
        safeRefetch(refetch, trendingRefectch);
      }
    }, [isInternetReachable, refetch, trendingRefectch]),
  );

  useEffect(() => {
    if (refreshing) {
      safeRefetch(refetch, trendingRefectch);
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
