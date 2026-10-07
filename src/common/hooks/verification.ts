import {verificationState} from '@/features/dashboard/verification/data';
import {useEffect, useState} from 'react';
import {useDisclosure} from './useDisclosure';
import {useAddressQuery, useVerificationQuery} from '@/apis/verification';
import {useOnRefresh} from './onrefresh';
import {useAppDispatch, useAppSelector} from './redux';
import {setAddressID} from '@/features/dashboard/slice';
import {useNavigation} from '@react-navigation/native';
import {TNavigation} from '../types/navigation';
import {ERoutes} from '../enum/routes';
import {useNetInfo} from '@react-native-community/netinfo';
import {setToast} from '../component/toast/slice';

export const useVerification = () => {
  const {refreshing, onRefresh} = useOnRefresh();
  const {isInternetReachable} = useNetInfo();
  const {isOpen, onClose, onOpen} = useDisclosure();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation<TNavigation>();
  const {addressId} = useAppSelector(state => state.dasshboard);
  const {inprogress} = useAppSelector(state => state.offline);
  const [filter, setFilter] = useState(verificationState[0]);
  const [limit, setLimit] = useState(10);
  const status = `?status=${filter?.value}&size=${limit}`;
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useVerificationQuery(status, {skip: !isInternetReachable});
  const {data: singleAdress, isFetching} = useAddressQuery(
    addressId as string,
    {
      skip: !addressId,
    },
  );

  const handleLimit = () => {
    if (Number(data?.data?.meta?.nextPage) > 1) {
      if (Number(data?.data?.addresses?.length) > 9) {
        return setLimit(prev => prev + 5);
      }
      return setLimit(10);
    }
    return;
  };

  const handleClick = (x: any) => {
    dispatch(setAddressID(x));
    onOpen();
  };

  useEffect(() => {
    if (addressId) {
      if (singleAdress) {
        return onOpen();
      }
    }
  }, [addressId, singleAdress, onOpen]);

  const handleClose = () => {
    dispatch(setAddressID(null));
    onClose();
  };

  const singleData = inprogress?.find(item => item._id === addressId);

  const handleNewVerification = () => {
    if (
      singleData?.status === 'inprogress' ||
      singleAdress?.data?.status === 'inprogress'
    ) {
      onClose();
      dispatch(setAddressID(null));
      navigate(ERoutes.NEW_VERIFICATION, {
        data: isInternetReachable ? singleAdress?.data?._id : singleData?._id,
      });
    } else {
      if (!isInternetReachable) {
        return dispatch(
          setToast({
            description:
              'You’ll be able to start verification as soon as you’re back online.',
            title: 'No connection',
            type: 'error',
          }),
        );
      }

      onClose();
      dispatch(setAddressID(null));
      navigate(ERoutes.NEW_VERIFICATION, {
        data: singleAdress?.data?._id || singleData?._id,
      });
    }
  };

  useEffect(() => {
    if (refreshing) {
      refetch();
    }
  }, [refetch, refreshing]);

  const verificationData =
    filter.value === 'inprogress' ? inprogress : data?.data?.addresses;

  return {
    filter,
    data:
      verificationData?.[0]?.status === filter.value ? verificationData : [],
    singleAdress: singleData ? singleData : singleAdress?.data,
    isLoading,
    isOpen,
    refreshing,
    isFetching,
    handleClick,
    setFilter,
    onClose: handleClose,
    onRefresh,
    handleNewVerification,
    handleLimit,
  };
};
