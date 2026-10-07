import {
  setIsSyncing,
  setOfflineData,
  setUpdatedOfflineData,
} from '@/features/dashboard/verification/new-verification/slice';
import {useAppDispatch, useAppSelector} from './redux';
import {setToast} from '../component/toast/slice';
import {useNavigation} from '@react-navigation/native';
import {ERoutes} from '../enum/routes';
import {TNavigation} from '../types/navigation';
import {useNetInfo} from '@react-native-community/netinfo';
import {clearCache} from '@/utils/base64-to-file';
import {
  useImageUploadMutation,
  useSubmitAddressMutation,
  useUpdateAddressInfoMutation,
  useUploadAudioMutation,
  useUploadSignatureMutation,
} from '@/apis/verification';
import {useEffect} from 'react';

export const useOffline = () => {
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation<TNavigation>();
  const {isInitialized, data} = useAppSelector(state => state.offline);
  const {isInternetReachable} = useNetInfo();
  const [uploadImage] = useImageUploadMutation();
  const [submitAddress] = useSubmitAddressMutation();
  const [updateAddress] = useUpdateAddressInfoMutation();
  const [uploadSignature] = useUploadSignatureMutation();
  const [uploadAudio] = useUploadAudioMutation();

  const handleSyncData = async ({
    payload,
    images,
    notes,
    signature,
    signatoryPath,
    audio,
    _id,
    status,
    position,
  }: any) => {
    await dispatch(
      setOfflineData({
        isInitialized: true,
        data: {
          payload,
          images,
          notes,
          signature,
          signatoryPath,
          audio,
          _id,
          status,
          position,
        },
      }),
    );
    dispatch(
      setToast({
        description: 'Task will be synced once there is coverage',
        title: 'Congratulation 🤝',
        type: 'success',
      }),
    );
    navigate(ERoutes.VERIFICATION);
  };

  const handleUploadSyncData = async () => {
    if (isInternetReachable && isInitialized) {
      if (data.length === 0) {
        return dispatch(setIsSyncing(false));
      }
      dispatch(setIsSyncing(true));
      const itemArray = Array.isArray(data) ? data : [data];
      for (let item of itemArray) {
        const image1 = new FormData();
        image1.append('image', {
          uri: item?.images[0]?.value,
          name: 'image.jpg',
          type: item?.images[0]?.type,
        });

        const image2 = new FormData();
        image2.append('image', {
          uri: item?.images[1]?.value,
          name: 'image.jpg',
          type: item?.images[1]?.type,
        });

        const image3 = new FormData();
        image3.append('image', {
          uri: item?.images[2]?.value,
          name: 'image.jpg',
          type: item?.images[2]?.type,
        });

        const signatoryData = new FormData();
        signatoryData.append('image', {
          uri: item?.signatoryPath,
          name: 'signatory.jpg',
          type: 'image/jpeg',
        });

        const audioData = new FormData();
        audioData.append('audio', {
          uri: item?.audio,
          name: 'audio.mp4',
          type: 'audio/mp4',
        });
        audioData.append('addressId', item?._id);
        const submitPayload = {
          address: item?._id,
          status: item?.status,
          position: item?.position,
        };

        const uploadPromises = [
          uploadImage(image1).unwrap(),
          uploadImage(image2).unwrap(),
          uploadImage(image3).unwrap(),
        ];

        if (item?.signatoryPath) {
          uploadPromises.push(uploadSignature(signatoryData).unwrap());
        }
        if (item?.audio) {
          uploadPromises.push(uploadAudio(audioData).unwrap());
        }

        try {
          const [image1Res, image2Res, image3Res, signatoryRes, audioRes] =
            await Promise.all(uploadPromises);

          const addressPayload = {
            address: item?._id,
            signature: signatoryRes?.data?.url || item?.signature,
            notes: item?.notes,
            images: [
              image1Res?.data?.url,
              image2Res?.data?.url,
              image3Res?.data?.url,
            ],
            buildingType: item?.payload.buildingType,
            buildingColor: item?.payload.buildingColor,
            gatePresent: Boolean(item?.payload.gatePresent === 'true'),
            gateColor: item?.payload.gateColor,
            closestLandmark: item?.payload.closestLandmark,
            audioUrl: audioRes?.data?.url || '',
          };

          const res = await updateAddress({...addressPayload}).unwrap();

          if (res.data) {
            await submitAddress({...submitPayload});
            // dispatch(
            //   setToast({
            //     description: 'Offline data successfully uploaded',
            //     title: 'Congratulation 🤝',
            //     type: 'success',
            //   }),
            // );
            await dispatch(
              setUpdatedOfflineData({
                data: item._id,
                isInitialized: true,
              }),
            );
          }
        } catch (error) {
          dispatch(
            setToast({
              description: 'Error uploading offline data',
              type: 'error',
            }),
          );
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      setUpdatedOfflineData({
        isInitialized: false,
        data: '',
      });
      dispatch(setIsSyncing(false));
      clearCache();
    }
  }, [data, dispatch]);

  return {handleSyncData, handleUploadSyncData};
};
