import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../common/hooks/redux';
import {useDisclosure} from '../../common/hooks/useDisclosure';
import {setAblyModal} from '@/lib/ably/slice';
import Sound from 'react-native-sound';
import {setToast} from '../../common/component/toast/slice';
import {useAcceptTaskMutation} from '@/apis/verification';

const sound = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    return error;
  }
});

export const useAbly = () => {
  const {isOpen: ablyIsOpen, data} = useAppSelector(state => state.ably);
  const {accessToken} = useAppSelector(state => state.auth);

  const {onClose, onOpen, isOpen} = useDisclosure();
  const dispatch = useAppDispatch();
  const [acceptTask, {isLoading}] = useAcceptTaskMutation();
  // const {navigate} = useNavigation<TNavigation>();

  useEffect(() => {
    if (accessToken) {
      if (ablyIsOpen) {
        onOpen();
        sound.play();
        sound.setNumberOfLoops(-1);
      }
    }
  }, [ablyIsOpen, accessToken, onOpen]);

  const handleClose = async () => {
    try {
      const res = await acceptTask({
        address: data?.addressId as string,
        task: data?.verificationId as string,
        status: 'decline',
      }).unwrap();
      dispatch(setToast({description: res?.data, type: 'success'}));
      dispatch(setAblyModal(false));
      onClose();
      sound.stop();
    } catch (error) {
      dispatch(setToast({description: error, type: 'error'}));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await acceptTask({
        address: data?.addressId as string,
        task: data?.verificationId as string,
        status: 'accept',
      }).unwrap();

      dispatch(setToast({description: res?.data, type: 'success'}));
      dispatch(setAblyModal(false));
      sound.stop();
      onClose();
    } catch (error) {
      dispatch(setToast({description: error, type: 'error'}));
    }
  };

  useEffect(() => {
    if (ablyIsOpen) {
      const timer = setTimeout(() => {
        dispatch(setAblyModal(false));
        onClose();
        sound.stop();
      }, 20000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [ablyIsOpen, dispatch, onClose]);

  return {isOpen, data, isLoading, handleClose, handleSubmit};
};
