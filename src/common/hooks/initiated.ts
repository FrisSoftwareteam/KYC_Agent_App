import {useEffect, useRef} from 'react';
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
  const {isOpen: offerOpen, data: offerData} = useAppSelector(
    state => state.ably,
  );
  const openOffer = useRef({offerOpen, offerData});
  openOffer.current = {offerOpen, offerData};

  // The same offer can arrive twice (live message and push notification): show it once.
  const showOffer = (offer: any) => {
    const now = openOffer.current;
    if (
      now.offerOpen &&
      String(now.offerData?.addressId) === String(offer?.addressId)
    ) {
      return;
    }
    dispatch(setAbly(offer));
    dispatch(setAblyModal(true));
  };

  // The 60-second timer is created once, so it must read the latest values
  // through a ref. Reading them directly would keep the values from the first
  // render (no user, no location yet) and the location would never be sent.
  const latest = useRef({
    user,
    status,
    isInternetReachable,
    locationPermission,
    handleLocation,
  });
  latest.current = {
    user,
    status,
    isInternetReachable,
    locationPermission,
    handleLocation,
  };
  const {location} = useAppSelector(state => state.ably);
  const hasLocation = Boolean(location?.coords);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = latest.current;
      if (now.user?.id && now.isInternetReachable && now.locationPermission) {
        now.handleLocation(now.status);
      }
    }, 60000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Send the location straight away when the agent goes online or offline,
  // when the first GPS fix arrives, and when the connection comes back.
  useEffect(() => {
    if (user?.id && isInternetReachable) {
      handleLocation(status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hasLocation, isInternetReachable, user?.id]);

  useEffect(() => {
    if (isInternetReachable) {
      handleUploadSyncData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInternetReachable]);

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = notificationListener(offer => {
      showOffer(offer);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ably && user && isInternetReachable) {
      const channel: any = ably.channels.get(
        String(`firstCheckAgent-${user?.agentId}`),
      );
      const onOffer = (message: any) => {
        showOffer(message.data);
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
