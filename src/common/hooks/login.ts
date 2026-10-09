import {setToast} from '@/common/component/toast/slice';
import {
  useFcmTokenMutation,
  useLoginMutation,
  useSyncLocationMutation,
} from '@/apis/auth';
import {useAppDispatch, useAppSelector} from '@/common/hooks/redux';
import {useState} from 'react';
import {TLoginRequest, LoginResponse} from '@/common/types/login';
import {useNavigation} from '@react-navigation/native';
import {TNavigation} from '../types/navigation';
import {setStatus, setUser, setWalkThrough} from '@/features/auth/slice';
import {getToken} from '@/lib/push-notification';
import {useDisclosure} from './useDisclosure';
import {useNetInfo} from '@react-native-community/netinfo';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const {location} = useAppSelector(state => state.ably);
  const {walkThroughSteps} = useAppSelector(state => state.auth);
  const {navigate} = useNavigation<TNavigation>();
  const {isInternetReachable} = useNetInfo();
  const [login, {isLoading}] = useLoginMutation();
  const [fcmToken] = useFcmTokenMutation();
  const [syncLocation] = useSyncLocationMutation();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);

  const [payload, setPayload] = useState<TLoginRequest>({
    password: '',
    email: '',
  });

  const handleChange = (e: string, key: string) => {
    setPayload((prev: any) => {
      return {
        ...prev,
        [key]: e,
      };
    });
  };

  const handleState = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (!isInternetReachable) {
      return dispatch(
        setToast({
          title: 'Check your internet connection',
          description: 'No network',
          type: 'error',
        }),
      );
    }

    const deviceToken = await getToken();
    const locationPayload = {
      status: 'online',
      position: {
        longitude: location?.coords?.longitude as number,
        latitude: location?.coords?.latitude as number,
      },
    };

    try {
      const loginResponse = await login({
        ...payload,
        email: payload.email.trim().toLowerCase(),
      }).unwrap();
      await dispatch(setUser({data: {...loginResponse.data}}));
      if (deviceToken) {
        await fcmToken({token: deviceToken});
      }
      await syncLocation({...locationPayload});
      await dispatch(setStatus('online'));
      if (walkThroughSteps === 0) {
        await dispatch(setWalkThrough({start: true, steps: 1}));
      }
      // console.log('ln 60', deviceToken);
    } catch (error) {
      dispatch(setToast({description: error, type: 'error'}));
    }
  };

  const handleUpdateToken = (data: LoginResponse) => {
    dispatch(setUser({...data}));
  };

  return {
    handleChange,
    handleSubmit,
    handleUpdateToken,
    handleState,
    onClose,
    onOpen,
    navigate,
    isLoading,
    showPassword,
    isOpen,
  };
};
