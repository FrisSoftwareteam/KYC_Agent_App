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
      // Close the offer either way (for example, another agent already took it).
      dispatch(setToast({description: error, type: 'error'}));
      dispatch(setAblyModal(false));
      onClose();
      sound.stop();
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
      // Close the offer either way (for example, another agent already took it).
      dispatch(setToast({description: error, type: 'error'}));
      dispatch(setAblyModal(false));
      onClose();
      sound.stop();
    }
  };

  useEffect(() => {
    if (ablyIsOpen) {
      const timer = setTimeout(() => {
        dispatch(setAblyModal(false));
        onClose();
        sound.stop();
      }, 100000); // the server waits 2 minutes before offering the job to someone else

      return () => {
        clearTimeout(timer);
      };
    }
  }, [ablyIsOpen, dispatch, onClose]);

  return {isOpen, data, isLoading, handleClose, handleSubmit};
};
