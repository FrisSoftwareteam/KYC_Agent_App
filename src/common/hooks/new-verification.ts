import {useNavigation, useRoute} from '@react-navigation/native';
import {TNavigation} from '../types/navigation';
import {useEffect, useRef, useState} from 'react';
import {ERoutes} from '../enum/routes';
import {setAddressID} from '@/features/dashboard/slice';
import {useAppDispatch, useAppSelector} from './redux';
import {
  useAddressQuery,
  useAddressStatusMutation,
  useImageUploadMutation,
  useSubmitAddressMutation,
  useUpdateAddressInfoMutation,
  useUploadSignatureMutation,
  useUploadAudioMutation,
} from '@/apis/verification';
import {launchCamera} from 'react-native-image-picker';
import {SignatureViewRef} from 'react-native-signature-canvas';
import {convertBase64ToFile, formatFilePath} from '@/utils/base64-to-file';
import {setToast} from '../component/toast/slice';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useOffline} from './offline';
import {useLocation} from './location';
import Config from 'react-native-config';

interface IFormInput {
  buildingType: string;
  buildingColor: string;
  gatePresent: string;
  gateColor: string;
  closestLandmark: string;
}

type TImage = Array<{name: string; value: string; type: string}>;

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
  // includeBase64: true,
};

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useNewVerification = () => {
  const SignatureRef = useRef<SignatureViewRef>(null);
  const {isInternetReachable} = useNetInfo();
  const {navigate} = useNavigation<TNavigation>();
  const {params}: any = useRoute();
  const navigateData = params?.data;
  const dispatch = useAppDispatch();
  const {location} = useAppSelector(state => state.ably);
  const {distanceBetweenPoints} = useLocation();
  const {handleSyncData} = useOffline();
  const {inprogress} = useAppSelector(state => state.offline);
  const [addressStatus] = useAddressStatusMutation();
  const [uploadImage, {isLoading}] = useImageUploadMutation();
  const [submitAddress, {isLoading: submitIsLoading}] =
    useSubmitAddressMutation();
  const [updateAddress, {isLoading: addressUpdateIsLoading}] =
    useUpdateAddressInfoMutation();
  const [uploadSignature, {isLoading: signatoryIsLoading}] =
    useUploadSignatureMutation();
  const [uploadAudio, {isLoading: audioIsLoading}] = useUploadAudioMutation();
  const {data, isFetching} = useAddressQuery(navigateData as string, {
    skip: !navigateData || !isInternetReachable,
  });
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<TImage>([]);
  const [signature, setSignature] = useState<string>();
  const [audio, setAudio] = useState<string>();
  const [confirmSignature, setConfirmSignature] = useState<any>();
  const [notes, setNotes] = useState({
    first: '',
    second: '',
    third: '',
  });
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [play, setPlay] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [payload, setPayload] = useState<IFormInput>({
    buildingType: '',
    buildingColor: '',
    gatePresent: '',
    gateColor: '',
    closestLandmark: '',
  });

  const singleData = inprogress?.find(item => item._id === navigateData);

  const handleChange = (value: any, name: any) => {
    if (step === 1) {
      return setPayload({...payload, [name]: value});
    } else if (name === 'typed') {
      return setSignature(value);
    } else {
      return setNotes({...notes, [name]: value});
    }
  };

  const validatePayload = (value: any) => {
    if (step === 1) {
      return Object.values(value).filter(Boolean).length >= 4;
    } else if (step === 2) {
      return Boolean(images.length === 3);
    } else if (step === 3) {
      return Object.values(notes).some(val => Boolean(val));
    } else {
      if (confirmSignature || signature) {
        return true;
      }
    }
  };

  const distanceData = isInternetReachable
    ? {
        lat: Number(data?.data?.position?.latitude),
        long: Number(data?.data?.position?.longitude),
      }
    : {
        lat: Number(singleData?.position.latitude),
        long: Number(singleData?.position.longitude),
      };

  const distance = distanceBetweenPoints(
    distanceData.lat,
    distanceData.long,
    'm',
  );

  const handleNext = async (value?: string) => {
    if (step === 4) {
      if (distance >= Config.DISTANCE) {
        return dispatch(
          setToast({
            description: 'Stay within the range of 0 to 100m to the address',
            title: 'Distance info',
            type: 'default',
          }),
        );
      }
      const signatoryPath = await convertBase64ToFile(confirmSignature).then(
        filePath => {
          return filePath;
        },
      );

      const audioPath = formatFilePath(audio);

      if (!isInternetReachable) {
        return handleSyncData({
          payload: payload,
          images: images,
          notes: Object.values(notes),
          signatoryPath: signatoryPath,
          signature: signature,
          audio: audioPath,
          _id: data?.data?._id || navigateData,
          status: value,
          position: {
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
          },
        });
      }

      const image1 = new FormData();
      image1.append('image', {
        uri: images[0]?.value,
        name: 'image.jpg',
        type: images[0]?.type,
      });

      const image2 = new FormData();
      image2.append('image', {
        uri: images[1]?.value,
        name: 'image.jpg',
        type: images[1]?.type,
      });

      const image3 = new FormData();
      image3.append('image', {
        uri: images[2]?.value,
        name: 'image.jpg',
        type: images[2]?.type,
      });

      const signatoryData = new FormData();
      signatoryData.append('image', {
        uri: signatoryPath,
        name: 'signatory.jpg',
        type: 'image/jpeg',
      });

      const audioData = new FormData();
      audioData.append('audio', {
        uri: audioPath,
        name: 'audio.mp4',
        type: 'audio/mp4',
      });
      audioData.append('addressId', data?.data?._id);

      const submitPayload = {
        address: data?.data?._id as string,
        status: value as string,
        position: {
          latitude: location?.coords?.latitude as number,
          longitude: location?.coords?.longitude as number,
        },
      };

      const uploadPromises = [
        uploadImage(image1).unwrap(),
        uploadImage(image2).unwrap(),
        uploadImage(image3).unwrap(),
      ];

      if (signatoryPath) {
        uploadPromises.push(uploadSignature(signatoryData).unwrap());
      }
      if (audioPath) {
        uploadPromises.push(uploadAudio(audioData).unwrap());
      }

      try {
        const [image1Res, image2Res, image3Res, signatoryRes, audioRes] =
          await Promise.all(uploadPromises);
        const addressPayload = {
          address: data?.data?._id as string,
          signature: signatoryRes?.data?.url || (signature as string),
          notes: Object.values(notes),
          images: [
            image1Res?.data?.url,
            image2Res?.data?.url,
            image3Res?.data?.url,
          ],
          buildingType: payload.buildingType,
          buildingColor: payload.buildingColor,
          gatePresent: Boolean(payload.gatePresent.toLowerCase() === 'true'),
          gateColor: payload.gateColor,
          closestLandmark: payload.closestLandmark,
          audioUrl: audioRes?.data?.url || '',
        };
        const res = await updateAddress({...addressPayload}).unwrap();
        if (res.data) {
          await submitAddress({...submitPayload});
          dispatch(
            setToast({
              description: res.data,
              title: 'Congratulation 🤝',
              type: 'success',
            }),
          );
          return navigate(ERoutes.VERIFICATION);
        }
      } catch (error) {
        dispatch(
          setToast({
            description: error,
            type: 'error',
          }),
        );
      }

      return;
    }

    if (validatePayload(payload)) {
      setStep(step + 1);
    }
  };

  const handlePrev = async (value?: string) => {
    if (value === 'cancel') {
      await dispatch(setAddressID(navigateData));
      navigate(ERoutes.VERIFICATION);
    }
    if (step === 1) {
      navigate(ERoutes.VERIFICATION);
      dispatch(setAddressID(navigateData));
    } else {
      setStep(step - 1);
    }
  };

  const handleImageUpload = async (value: string) => {
    const result: any = await launchCamera(options as any);
    if (!result.cancelled) {
      setImages((prev: any) => {
        const index = prev.findIndex((item: any) => item.name === value);

        if (index !== -1) {
          return prev.map((item: any, i: number) =>
            i === index ? {...item, value: result.assets[0].uri} : item,
          );
        } else {
          return [
            ...prev,
            {
              value: result.assets[0].uri,
              name: value,
              type: result.assets[0].type,
            },
          ];
        }
      });
    }
  };

  const handleSignature = (value: any) => {
    setConfirmSignature(value);
  };

  const handleUndoSignature = () => {
    if (!SignatureRef.current) {
      return;
    }
    SignatureRef.current?.undo();
  };

  const handleRedoSignature = () => {
    if (!SignatureRef.current) {
      return;
    }
    SignatureRef.current?.redo();
  };

  const handleEnd = () => {
    if (!SignatureRef.current) {
      return;
    }
    SignatureRef.current.readSignature();
  };

  const permission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          dispatch(
            setToast({
              description: 'Try again',
              title: 'Permissions not granted',
              type: 'error',
            }),
          );

          return false;
        }
      } catch (err) {
        dispatch(
          setToast({
            description: err,
            title: 'Permissions Info',
            type: 'error',
          }),
        );
        return false;
      }
    }
  };

  const onStartRecord = async () => {
    const permissionGranted = await permission();

    if (permissionGranted) {
      await audioRecorderPlayer.startRecorder();
      setRecording(true);
    }
  };

  const onStopRecord = async (arg: string) => {
    if (arg === 'cancel') {
      await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setRecorded(false);
      setRecordTime(0);
      setAudio('');
      return;
    }

    const res = await audioRecorderPlayer.stopRecorder();

    setRecording(false);
    setRecorded(true);
    setAudio(res);
  };

  const onStartPlay = async () => {
    const formattedPath = formatFilePath(audio as string);
    await audioRecorderPlayer.startPlayer(formattedPath);
    setPlay(true);
    setPlayTime(0);
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    setPlay(false);
  };

  useEffect(() => {
    const handleAddressStatus = async () => {
      await addressStatus({
        address: navigateData,
        status: 'inprogress',
      });
    };

    if (
      singleData?.status === 'accepted' ||
      data?.data?.status === 'accepted'
    ) {
      if (isInternetReachable) {
        handleAddressStatus();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressStatus, navigateData, isFetching]);

  useEffect(() => {
    if (recording) {
      const timer = setInterval(() => {
        setRecordTime(prevSeconds => {
          if (prevSeconds >= 60) {
            clearInterval(timer);
            onStopRecord('');
            return 60;
          }
          return prevSeconds + 1;
        });
        setPlayTime(prevSeconds => {
          if (prevSeconds >= 60) {
            clearInterval(timer);
            onStopRecord('');
            return 60;
          }
          return prevSeconds + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [recording]);

  useEffect(() => {
    if (play) {
      setPlayTime(recordTime);
      const timer = setInterval(() => {
        setPlayTime(prevSeconds => {
          if (prevSeconds <= 0) {
            clearInterval(timer);
            onPausePlay();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  return {
    data: singleData ? singleData : data,
    payload,
    step,
    setPayload,
    handleChange,
    validatePayload,
    handleNext,
    handlePrev,
    handleImageUpload,
    handleSignature,
    handleEnd,
    onStartRecord,
    onStopRecord,
    onStartPlay,
    onPausePlay,
    handleRedoSignature,
    handleUndoSignature,
    playTime,
    play,
    recorded,
    recording,
    recordTime,
    images,
    notes,
    SignatureRef,
    signature,
    addressUpdateIsLoading: Boolean(
      addressUpdateIsLoading ||
        signatoryIsLoading ||
        isLoading ||
        submitIsLoading ||
        audioIsLoading,
    ),
  };
};
