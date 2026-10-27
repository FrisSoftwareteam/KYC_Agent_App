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
        description:
          'No internet. The visit is saved on this phone and will be sent automatically when you are back online.',
        title: 'Saved',
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
      let failed = false;
      for (let item of itemArray) {
        const imageForm = (img?: {value: string; type: string}) => {
          const form = new FormData();
          form.append('image', {
            uri: img?.value,
            name: 'image.jpg',
            type: img?.type || 'image/jpeg',
          } as any);
          return form;
        };

        try {
          // Uploads kept apart so links can never land in the wrong field.
          const [imageResults, signatoryRes, audioRes] = await Promise.all([
            Promise.all(
              (item?.images || [])
                .slice(0, 3)
                .map((img: any) => uploadImage(imageForm(img)).unwrap()),
            ),
            item?.signatoryPath
              ? uploadSignature(
                  (() => {
                    const form = new FormData();
                    form.append('image', {
                      uri: item?.signatoryPath,
                      name: 'signatory.jpg',
                      type: 'image/jpeg',
                    } as any);
                    return form;
                  })(),
                ).unwrap()
              : Promise.resolve(undefined),
            item?.audio
              ? uploadAudio(
                  (() => {
                    const form = new FormData();
                    form.append('audio', {
                      uri: item?.audio,
                      name: 'audio.mp4',
                      type: 'audio/mp4',
                    } as any);
                    form.append('addressId', item?._id);
                    return form;
                  })(),
                ).unwrap()
              : Promise.resolve(undefined),
          ]);

          await updateAddress({
            address: item?._id,
            signature: signatoryRes?.data?.url || item?.signature,
            notes: item?.notes,
            images: imageResults.map((res: any) => res?.data?.url),
            buildingType: item?.payload.buildingType,
            buildingColor: item?.payload.buildingColor,
            gatePresent:
              String(item?.payload.gatePresent).toLowerCase() === 'true',
            gateColor: item?.payload.gateColor,
            closestLandmark: item?.payload.closestLandmark,
            audioUrl: audioRes?.data?.url || '',
          }).unwrap();

          await submitAddress({
            address: item?._id,
            status: item?.status,
            position: item?.position,
          }).unwrap();

          await dispatch(
            setUpdatedOfflineData({
              data: item._id,
              isInitialized: true,
            }),
          );
        } catch (error) {
          failed = true;
          dispatch(
            setToast({
              title: 'Saved visit not sent yet',
              description:
                'A visit saved offline could not be sent. It will try again when your connection is better.',
              type: 'error',
            }),
          );
          break;
        }
      }
      // Always close the "Syncing" box, even after a failure, so the app is never blocked.
      dispatch(setIsSyncing(false));
      if (!failed) {
        clearCache();
      }
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      dispatch(setIsSyncing(false));
    }
  }, [data, dispatch]);

  return {handleSyncData, handleUploadSyncData};
};
