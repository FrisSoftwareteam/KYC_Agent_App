import {useNetInfo} from '@react-native-community/netinfo';

// The phone's "internet reachable" check is often unknown (null) for a while, or wrong on
// slow networks. Treating unknown as offline blocked logins, emptied lists and hid jobs.
// Only a definite "no internet" counts as offline.
export const useIsOnline = () => {
  const {isInternetReachable} = useNetInfo();
  return isInternetReachable !== false;
};
