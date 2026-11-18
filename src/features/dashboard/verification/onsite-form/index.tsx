import {theme} from '@/providers/theme-provider';
import {
  Button,
  ButtonSpinner,
  ButtonText,
  HStack,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  VStack,
} from '@gluestack-ui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChevronDown, ChevronRight, X} from 'lucide-react-native';
import {
  TOnsiteForm,
  useOnsiteFormQuery,
  useSaveOnsiteFormMutation,
} from '@/apis/onsite-form';
import {
  useImageUploadMutation,
  useUploadAudioMutation,
  useUploadSignatureMutation,
  useUploadVideoMutation,
} from '@/apis/verification';
import {useAppDispatch} from '@/common/hooks/redux';
import {setToast} from '@/common/component/toast/slice';
import {useIsOnline} from '@/common/hooks/online';
import {TNavigation} from '@/common/types/navigation';
import {OnsiteField, TUploader} from './fields';
import {missingIn, missingInForm} from './missing';

// Credit and Loans KYC: the onsite KYC form (items 1-35), filled in at the business.
// Every change is kept on the phone at once and saved to CleCheck a moment later, so
// nothing is lost if the network drops. Photos need the internet to upload.
export function OnsiteForm() {
  const {goBack} = useNavigation<TNavigation>();
  const {params}: any = useRoute();
  const addressId: string = params?.addressId;
  const draftKey = `onsite-form:${addressId}`;
  const dispatch = useAppDispatch();
  const online = useIsOnline();
  const {data, isFetching, refetch} = useOnsiteFormQuery(addressId, {skip: !addressId});
  const [save, {isLoading: saving}] = useSaveOnsiteFormMutation();
  const [uploadImage] = useImageUploadMutation();
  const [uploadSignature] = useUploadSignatureMutation();
  const [uploadVideo] = useUploadVideoMutation();
  const [uploadAudio] = useUploadAudioMutation();

  const form = data?.data;
  const definition = useMemo(() => form?.definition || [], [form]);
  const [answers, setAnswers] = useState<Record<string, any> | undefined>();
  const [open, setOpen] = useState<string | undefined>();
  const [state, setState] = useState<'saved' | 'unsaved' | 'saving' | 'offline'>('saved');
  // The latest save's answer from CleCheck: NIN results and the geotag distance.
  const [checks, setChecks] = useState<TOnsiteForm['checks']>();
  const timer = useRef<any>();
  const latest = useRef<Record<string, any>>({});

  // Start from the phone's draft if there is one newer than the server's copy.
  useEffect(() => {
    if (!form?.applies || answers) {
      return;
    }
    (async () => {
      const server =
        form.answers && Object.keys(form.answers).length ? form.answers : form.prefill || {};
      let start = server;
      try {
        const raw = await AsyncStorage.getItem(draftKey);
        const draft = raw ? JSON.parse(raw) : undefined;
        const serverAt = form.updatedAt ? new Date(form.updatedAt).getTime() : 0;
        if (draft?.answers && Number(draft.at) > serverAt) {
          start = draft.answers;
        }
      } catch (e) {}
      latest.current = start;
      setAnswers(start);
    })();
  }, [form, answers, draftKey]);

  const toServer = useCallback(async () => {
    if (!online) {
      setState('offline');
      return false;
    }
    setState('saving');
    try {
      const res = await save({addressId, answers: latest.current}).unwrap();
      setChecks(res?.data?.checks);
      setState('saved');
      return true;
    } catch (e: any) {
      setState('unsaved');
      dispatch(
        setToast({
          title: 'Not saved to CleCheck',
          description: e?.data?.message || 'It is kept on this phone. Try again.',
          type: 'error',
        }),
      );
      return false;
    }
  }, [online, save, addressId, dispatch]);

  const change = (key: string, value: any) => {
    const next = {...latest.current, [key]: value};
    latest.current = next;
    setAnswers(next);
    setState('unsaved');
    AsyncStorage.setItem(draftKey, JSON.stringify({at: Date.now(), answers: next})).catch(
      () => undefined,
    );
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      toServer();
    }, 2500);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  const error = (title: string, description?: string) =>
    dispatch(setToast({title, description: description || 'Please try again.', type: 'error'}));

  const needOnline = () => {
    if (!online) {
      error('No internet', 'Photos, videos and signatures need the internet to upload.');
      return false;
    }
    return true;
  };

  const upload: TUploader = {
    error,
    photo: async (uri, type) => {
      if (!needOnline()) {
        return;
      }
      const f = new FormData();
      f.append('image', {uri, name: 'onsite.jpg', type: type || 'image/jpeg'} as any);
      const res: any = await uploadImage(f)
        .unwrap()
        .catch(() => error('Photo not uploaded'));
      return res?.data?.url;
    },
    video: async uri => {
      if (!needOnline()) {
        return;
      }
      const f = new FormData();
      f.append('video', {uri, name: 'onsite.mp4', type: 'video/mp4'} as any);
      f.append('addressId', addressId);
      const res: any = await uploadVideo(f)
        .unwrap()
        .catch(() => error('Video not uploaded'));
      return res?.data?.url;
    },
    audio: async uri => {
      if (!needOnline()) {
        return;
      }
      const f = new FormData();
      f.append('audio', {uri, name: 'onsite.mp4', type: 'audio/mp4'} as any);
      f.append('addressId', addressId);
      const res: any = await uploadAudio(f)
        .unwrap()
        .catch(() => error('Voice recording not uploaded'));
      return res?.data?.url;
    },
    signature: async uri => {
      if (!needOnline()) {
        return;
      }
      const f = new FormData();
      f.append('image', {uri, name: 'signature.jpg', type: 'image/jpeg'} as any);
      const res: any = await uploadSignature(f)
        .unwrap()
        .catch(() => error('Signature not uploaded'));
      return res?.data?.url;
    },
  };

  const missing = useMemo(() => missingInForm(definition, answers || {}), [definition, answers]);

  const done = async () => {
    clearTimeout(timer.current);
    const ok = state === 'saved' || (await toServer());
    if (ok) {
      await refetch();
      goBack();
    }
  };

  const statusText =
    state === 'saving'
      ? 'Saving…'
      : state === 'offline'
      ? 'Kept on this phone. It will save when you are back online.'
      : state === 'unsaved'
      ? 'Changes kept on this phone'
      : 'Saved';

  return (
    <View w={'$full'} h={'$full'} bg={theme.colors.primary.white}>
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
      <SafeAreaView flex={1}>
        <HStack px={'$5'} pt={'$4'} pb={'$2'} alignItems={'center'} space={'md'}>
          <TouchableOpacity onPress={done}>
            <X width={22} height={22} color={theme.colors.grey.solid} />
          </TouchableOpacity>
          <VStack flex={1}>
            <Text fontFamily={theme.fontFamily.medium} fontSize={'$lg'} color={theme.colors.primary.DEFAULT}>
              Onsite KYC form
            </Text>
            <Text fontSize={'$xs'} color={theme.colors.grey[300]}>
              {statusText}
            </Text>
          </VStack>
        </HStack>

        <View
          mx={'$5'}
          p={'$3'}
          borderRadius={'$md'}
          bg={missing.length ? '#FFF7E6' : '#ECFDF3'}>
          <Text fontSize={'$sm'} color={missing.length ? '#7A4B00' : '#067647'}>
            {missing.length
              ? `${missing.length} required ${missing.length === 1 ? 'answer' : 'answers'} still needed before you can submit the visit as verified.`
              : 'Every required answer is filled in. You can submit the visit.'}
          </Text>
        </View>

        {!form && isFetching ? (
          <Text m={'$5'}>Loading the form…</Text>
        ) : form && !form.applies ? (
          <Text m={'$5'}>This visit has no onsite form.</Text>
        ) : (
          <ScrollView px={'$5'} mt={'$3'} showsVerticalScrollIndicator={false}>
            <VStack space={'md'} pb={'$24'}>
              {definition.map(section => {
                const left = missingIn(section.fields, answers || {}).length;
                const isOpen = open === section.key;
                return (
                  <View key={section.key} borderWidth={1} borderColor={'#E4E7EC'} borderRadius={'$lg'}>
                    <TouchableOpacity onPress={() => setOpen(isOpen ? undefined : section.key)}>
                      <HStack p={'$4'} alignItems={'center'} space={'sm'}>
                        {isOpen ? (
                          <ChevronDown width={18} height={18} color={theme.colors.grey.solid} />
                        ) : (
                          <ChevronRight width={18} height={18} color={theme.colors.grey.solid} />
                        )}
                        <Text flex={1} fontFamily={theme.fontFamily.medium} color={theme.colors.grey[200]}>
                          {section.title}
                        </Text>
                        <Text fontSize={'$xs'} color={left ? '#B54708' : '#067647'}>
                          {left ? `${left} needed` : 'Done'}
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                    {isOpen && answers && (
                      <VStack px={'$4'} pb={'$4'} space={'xl'}>
                        {Boolean(section.help) && (
                          <Text fontSize={'$sm'} color={theme.colors.grey[300]}>
                            {section.help}
                          </Text>
                        )}
                        {section.fields.map(field => (
                          <OnsiteField
                            key={field.key}
                            field={field}
                            value={answers[field.key]}
                            onChange={v => change(field.key, v)}
                            upload={upload}
                            check={
                              field.type === 'location'
                                ? ((checks || form?.checks)?.geotag?.[field.key] as any)
                                : ((checks || form?.checks)?.nin?.[field.key] as any)
                            }
                          />
                        ))}
                      </VStack>
                    )}
                  </View>
                );
              })}

              <Button bg={theme.colors.primary.DEFAULT} onPress={done} isDisabled={saving}>
                <ButtonText>Save and go back to the visit</ButtonText>
                {saving && <ButtonSpinner ml={'$1'} color={theme.colors.primary.white} />}
              </Button>
            </VStack>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
