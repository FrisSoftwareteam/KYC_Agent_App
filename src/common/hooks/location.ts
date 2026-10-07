import {useSyncLocationMutation} from '@/apis/auth';
import Geolocation from '@react-native-community/geolocation';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from './redux';
import {setLocation} from '@/lib/ably/slice';

export const useLocation = () => {
  const dispatch = useAppDispatch();
  const [syncLocation] = useSyncLocationMutation();
  const {user} = useAppSelector(state => state.auth);
  const {location} = useAppSelector(state => state.ably);

  const handleLocation = async (status: string) => {
    const payload = {
      status: status,
      position: {
        longitude: location?.coords?.longitude as number,
        latitude: location?.coords?.latitude as number,
      },
    };

    if (user?.id && location?.coords) {
      await syncLocation({...payload});
    }
  };

  const distanceBetweenPoints = (
    latitude: number,
    longitude: number,
    unit: string,
  ): number => {
    const agentLat = location?.coords?.latitude as number;
    const agentLog = location?.coords?.longitude as number;
    if (
      latitude === location?.coords?.latitude &&
      longitude === location?.coords?.longitude
    ) {
      return 0;
    } else {
      const radiusLatitude1 = (Math.PI * latitude) / 180;
      const radiusLatitude2 = (Math.PI * agentLat) / 180;
      const theta = longitude - agentLog;
      const radiusTheta = (Math.PI * theta) / 180;
      let distance =
        Math.sin(radiusLatitude1) * Math.sin(radiusLatitude2) +
        Math.cos(radiusLatitude1) *
          Math.cos(radiusLatitude2) *
          Math.cos(radiusTheta);
      if (distance > 1) {
        distance = 1;
      }
      distance = Math.acos(distance);
      distance = (distance * 180) / Math.PI;
      distance = distance * 60 * 1.1515;

      if (unit.toLowerCase() === 'k') {
        distance = distance * 1.609344;
      }
      if (unit.toLowerCase() === 'm') {
        distance = distance * 1609.344;
      }
      if (unit.toLowerCase() === 'n') {
        distance = distance * 0.8684;
      }

      return distance;
    }
  };

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        dispatch(setLocation(position));
      },
      error => {
        return error;
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        useSignificantChanges: true,
      },
    );

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [dispatch]);

  return {
    handleLocation,
    distanceBetweenPoints,
  };
};
