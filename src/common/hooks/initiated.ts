import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from './redux';
import {ably} from '@/lib/ably';
import {setAbly, setAblyModal} from '@/lib/ably/slice';
import {
  requestUserPermission,
  notificationListener,
} from '@/lib/push-notification';
import {useLocation} from './location';
import {useOffline} from './offline';
import {useNetInfo} from '@react-native-community/netinfo';

export const useInitiated = () => {
  const {user, status, accessToken} = useAppSelector(state => state.auth);
  const {locationPermission} = useAppSelector(state => state.ably);
  const {handleLocation} = useLocation();
  const {handleUploadSyncData} = useOffline();
  const {isInternetReachable} = useNetInfo();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setInterval(async () => {
      if (user?.id && isInternetReachable) {
        if (locationPermission) {
          handleLocation(status);
        }
      }
    }, 60000);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.id && isInternetReachable) {
      handleLocation(status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (isInternetReachable) {
      handleUploadSyncData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInternetReachable]);

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  useEffect(() => {
    if (ably && user && isInternetReachable) {
      const channel: any = ably.channels.get(
        String(`firstCheckAgent-${user?.agentId}`),
      );
      const onOffer = (message: any) => {
        dispatch(setAbly(message.data));
        dispatch(setAblyModal(true));
      };
      channel.subscribe('addressNotificationEvent', onOffer);

      return () => {
        channel.unsubscribe('addressNotificationEvent', onOffer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInternetReachable]);

  return {accessToken};
};
