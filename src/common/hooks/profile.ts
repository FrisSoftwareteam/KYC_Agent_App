import {useProfileQuery, useUploadProfilePictureMutation} from '@/apis/auth';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {TNavigation} from '../types/navigation';
import {useState} from 'react';
import {useAppDispatch, useAppSelector} from './redux';
import {setToast} from '../component/toast/slice';
import {logOut, setStatus, setWalkThrough} from '@/features/auth/slice';
import {useLocation} from './location';

const options = {
  title: 'Select Photo',
  mediaType: 'photo',
  saveToPhotos: false,
  storageOptions: {
    skipBackup: true,
  },
  maxWidth: 800, // Android only
  maxHeight: 600, // Android only
  quality: 80, // Android only
  allowsEditing: true, // iOS only
};

export const useProfile = () => {
  const {navigate} = useNavigation<TNavigation>();
  const {data, refetch} = useProfileQuery('');
  const dispatch = useAppDispatch();
  const {handleLocation} = useLocation();
  const {status} = useAppSelector(state => state.auth);
  const [uploadProfilePicture, {isLoading}] = useUploadProfilePictureMutation();
  const [payload, setPayload] = useState<any>();

  const handleProileUpdate = async () => {
    const result: any = await launchImageLibrary(options as any);

    if (!result.cancelled) {
      setPayload(result);
    }
  };

  const handleSubmit = async () => {
    if (payload) {
      const formData = new FormData();
      formData.append('image', {
        uri: payload.assets[0].uri,
        name: 'image.jpg',
        type: payload.assets[0].type,
      });
      const res = await uploadProfilePicture(formData).unwrap();
      if (res?.data) {
        dispatch(
          setToast({
            description: res.data,
            type: 'success',
          }),
        );
        refetch();
        setPayload(null);
      }
    }
  };

  const handleStatus = (value: any) => {
    const val = value === true ? 'online' : 'offline';
    dispatch(setStatus(val));
  };

  const handleLogout = async () => {
    await handleLocation('offline');
    dispatch(logOut());
  };

  const handleGuide = () => {
    dispatch(setWalkThrough({steps: 4, start: false}));
  };

  return {
    data,
    handleProileUpdate,
    handleSubmit,
    handleStatus,
    handleLogout,
    handleGuide,
    navigate,
    payload,
    isLoading,
    status,
  };
};
