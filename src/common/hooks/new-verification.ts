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
import {Alert, PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import {useIsOnline} from '@/common/hooks/online';
import {useOffline} from './offline';
import {useLocation} from './location';
import {formatDistance} from '@/utils/distance';
import Config from 'react-native-config';

const MAX_DISTANCE_METRES =
  Number(Config.DISTANCE) > 0 ? Number(Config.DISTANCE) : 100;

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
  quality: 0.8, // 0 to 1 (80 was ignored, so full-size photos were uploaded)
  allowsEditing: true, // iOS only
  // includeBase64: true,
};

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useNewVerification = () => {
  const SignatureRef = useRef<SignatureViewRef>(null);
  const isInternetReachable = useIsOnline();
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

  const hasLocation =
    Number.isFinite(Number(location?.coords?.latitude)) &&
    Number.isFinite(Number(location?.coords?.longitude));

  const distance = hasLocation
    ? distanceBetweenPoints(distanceData.lat, distanceData.long, 'm')
    : NaN;

  // Ask before submitting a visit that is far from the address pin. The pin is a guess
  // from the typed address and is often wrong, so the agent may submit; the visit is
  // then flagged for review on the dashboard instead of being blocked.
  const confirmFarAway = (metres: number) =>
    new Promise<boolean>(resolve => {
      Alert.alert(
        'Far from the address pin',
        `You are about ${formatDistance(
          metres,
        )} from where the map places this address. ` +
          'If you are at the right building, you can still submit; the visit will be marked for review.',
        [
          {text: 'Cancel', style: 'cancel', onPress: () => resolve(false)},
          {text: 'Submit anyway', onPress: () => resolve(true)},
        ],
        {cancelable: true, onDismiss: () => resolve(false)},
      );
    });

  const handleNext = async (value?: string, reason?: string) => {
    if (step === 4) {
      if (!hasLocation) {
        return dispatch(
          setToast({
            title: 'Waiting for your location',
            description:
              'Turn on location, step outside for a moment, then press Submit again.',
            type: 'error',
          }),
        );
      }

      if (Number.isFinite(distance) && distance >= MAX_DISTANCE_METRES) {
        const ok = await confirmFarAway(distance);
        if (!ok) {
          return;
        }
      }

      const signatoryPath = await convertBase64ToFile(confirmSignature).then(
        filePath => {
          return filePath;
        },
      );

      const audioPath = formatFilePath(audio);
      const allNotes = reason
        ? [`Reason not verified: ${reason}`, ...Object.values(notes)]
        : Object.values(notes);

      if (!isInternetReachable) {
        return handleSyncData({
          payload: payload,
          images: images,
          notes: allNotes,
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

      const addressId = (data?.data?._id || navigateData) as string;

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
        // Each upload is kept apart, so a missing signature or voice note can
        // never shift another file's link into the wrong field.
        const [imageResults, signatoryRes, audioRes] = await Promise.all([
          Promise.all(
            images.slice(0, 3).map(img => uploadImage(imageForm(img)).unwrap()),
          ),
          signatoryPath
            ? uploadSignature(
                (() => {
                  const form = new FormData();
                  form.append('image', {
                    uri: signatoryPath,
                    name: 'signatory.jpg',
                    type: 'image/jpeg',
                  } as any);
                  return form;
                })(),
              ).unwrap()
            : Promise.resolve(undefined),
          audioPath
            ? uploadAudio(
                (() => {
                  const form = new FormData();
                  form.append('audio', {
                    uri: audioPath,
                    name: 'audio.mp4',
                    type: 'audio/mp4',
                  } as any);
                  form.append('addressId', addressId);
                  return form;
                })(),
              ).unwrap()
            : Promise.resolve(undefined),
        ]);

        const addressPayload = {
          address: addressId,
          signature: signatoryRes?.data?.url || (signature as string),
          notes: allNotes,
          images: imageResults.map(res => res?.data?.url),
          buildingType: payload.buildingType,
          buildingColor: payload.buildingColor,
          gatePresent: String(payload.gatePresent).toLowerCase() === 'true',
          gateColor: payload.gateColor,
          closestLandmark: payload.closestLandmark,
          audioUrl: audioRes?.data?.url || '',
        };
        await updateAddress({...addressPayload}).unwrap();
        // Only report success once the server has accepted the submission.
        await submitAddress({
          address: addressId,
          status: value as string,
          position: {
            latitude: location?.coords?.latitude as number,
            longitude: location?.coords?.longitude as number,
          },
        }).unwrap();
        dispatch(
          setToast({
            description:
              value === 'failed'
                ? 'Submitted as not verified.'
                : 'Verification submitted.',
            title: 'Done',
            type: 'success',
          }),
        );
        return navigate(ERoutes.VERIFICATION);
      } catch (error) {
        dispatch(
          setToast({
            title: 'Not submitted. Please try again.',
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
    if (result?.errorCode) {
      dispatch(
        setToast({
          title: 'Camera not available',
          description:
            result.errorCode === 'permission'
              ? 'Allow camera access for CleCheck Agent in your phone settings.'
              : result.errorMessage || 'Please try again.',
          type: 'error',
        }),
      );
      return;
    }
    if (!result?.didCancel && result?.assets?.length) {
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
    distance,
    hasLocation,
    maxDistance: MAX_DISTANCE_METRES,
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
