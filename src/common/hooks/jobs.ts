import {useAvailableJobsQuery} from '@/apis/verification';
import {useAppSelector} from './redux';

// Open jobs near the agent, asked for every 30 seconds while the agent is online.
// Jobs no longer depend only on the live offer reaching the phone.
export const useNearbyJobs = () => {
  const {user, status} = useAppSelector(state => state.auth);
  const {location} = useAppSelector(state => state.ably);
  const lat = Number(location?.coords?.latitude);
  const lng = Number(location?.coords?.longitude);
  const hasFix = Number.isFinite(lat) && Number.isFinite(lng);
  // Rounded to about 100 m so the request does not change with every GPS wobble.
  const args = hasFix
    ? {
        latitude: Math.round(lat * 1000) / 1000,
        longitude: Math.round(lng * 1000) / 1000,
      }
    : {};
  const online = Boolean(user?.id) && status === 'online';

  const {data, isFetching, refetch} = useAvailableJobsQuery(args, {
    skip: !online,
    pollingInterval: 30000,
  });

  return {
    online,
    located: hasFix || Boolean(data?.data?.located),
    jobs: online ? data?.data?.jobs || [] : [],
    isFetching,
    refetch,
  };
};
