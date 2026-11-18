import {theme} from '@/providers/theme-provider';
import {
  Button,
  ButtonSpinner,
  ButtonText,
  ChevronDownIcon,
  HStack,
  Icon,
  Image,
  Input,
  InputField,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
  Text,
  Textarea,
  TextareaInput,
  View,
  VStack,
} from '@gluestack-ui/themed';
import React, {useRef, useState} from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {X} from 'lucide-react-native';
import {TOnsiteField} from '@/apis/onsite-form';
import {convertBase64ToFile, formatFilePath} from '@/utils/base64-to-file';

export type TFile = {url: string; type?: string; name?: string};

// Upload helpers handed in by the screen (they need the visit's id and the API).
export type TUploader = {
  photo: (uri: string, type?: string) => Promise<string | undefined>;
  video: (uri: string) => Promise<string | undefined>;
  audio: (uri: string) => Promise<string | undefined>;
  signature: (uri: string) => Promise<string | undefined>;
  error: (title: string, description?: string) => void;
};

type TFieldProps = {
  field: TOnsiteField;
  value: any;
  onChange: (value: any) => void;
  upload: TUploader;
  check?: {status: string; recordName?: string; metres?: number};
  onDrawing?: (drawing: boolean) => void;
};

const recorder = new AudioRecorderPlayer();

export function Label({field}: {field: TOnsiteField}) {
  return (
    <VStack mb={'$2'}>
      <Text
        color={theme.colors.grey[200]}
        fontFamily={theme.fontFamily.medium}
        fontSize={'$md'}>
        {field.label}
        {field.required ? <Text color={'#D92D20'}> *</Text> : null}
      </Text>
      {Boolean(field.help) && (
        <Text fontSize={'$xs'} color={theme.colors.grey[300]}>
          {field.help}
        </Text>
      )}
    </VStack>
  );
}

// DD/MM/YYYY as typed, YYYY-MM-DD as stored.
const toIso = (typed: string) => {
  const m = typed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
};
const fromIso = (iso?: string) => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
};
const withSlashes = (typed: string) => {
  const d = typed.replace(/\D/g, '').slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/');
};

const NIN_WORDS: Record<string, string> = {
  match: 'NIN checked: the name matches',
  mismatch: 'NIN checked: the name does not match',
  no_name: 'NIN found',
  not_found: 'No NIN record found for this number',
  unchecked: 'NIN not checked yet (will be checked on the next save)',
};
const PLACE_WORDS: Record<string, string> = {
  at_address: 'At the address',
  near_address: 'Near the address',
  away_from_address: 'Away from the address: check you are at the business',
};

function CheckNote({check, nin}: {check: any; nin?: boolean}) {
  if (!check) {
    return null;
  }
  const good = nin ? check.status === 'match' : check.status === 'at_address';
  const text = nin
    ? `${NIN_WORDS[check.status] || check.status}${
        check.recordName ? ` (${check.recordName})` : ''
      }`
    : `${PLACE_WORDS[check.status] || check.status} (${check.metres} m)`;
  return (
    <Text mt={'$1'} fontSize={'$xs'} color={good ? '#067647' : '#B54708'}>
      {text}
    </Text>
  );
}

function TextField({field, value, onChange, check}: TFieldProps) {
  const numeric = field.type === 'number' || Boolean(field.digits);
  if (field.type === 'textarea') {
    return (
      <Textarea size={'md'}>
        <TextareaInput
          value={value ?? ''}
          placeholder={'Type here'}
          onChangeText={onChange}
        />
      </Textarea>
    );
  }
  return (
    <View>
      <Input size={'lg'}>
        <InputField
          value={value === undefined || value === null ? '' : String(value)}
          placeholder={field.digits ? `${field.digits} digits` : 'Type here'}
          placeholderTextColor={theme.colors.grey[300]}
          keyboardType={numeric ? 'number-pad' : 'default'}
          maxLength={field.digits}
          onChangeText={(t: string) =>
            onChange(
              field.type === 'number'
                ? t.replace(/[^\d.]/g, '')
                : field.digits
                ? t.replace(/\D/g, '')
                : t,
            )
          }
        />
      </Input>
      {field.nin && <CheckNote check={check} nin />}
    </View>
  );
}

function DateField({value, onChange}: TFieldProps) {
  const [typed, setTyped] = useState(fromIso(value));
  return (
    <Input size={'lg'}>
      <InputField
        value={typed}
        placeholder={'DD/MM/YYYY'}
        placeholderTextColor={theme.colors.grey[300]}
        keyboardType={'number-pad'}
        maxLength={10}
        onChangeText={(t: string) => {
          const next = withSlashes(t);
          setTyped(next);
          onChange(toIso(next) || undefined);
        }}
      />
    </Input>
  );
}

function SelectField({field, value, onChange}: TFieldProps) {
  return (
    <Select onValueChange={onChange} selectedValue={value ?? ''}>
      <SelectTrigger variant="outline" size={'lg'}>
        <SelectInput placeholder={'Choose'} value={value ?? ''} />
        <View mr={'$3'} mt={'$2'}>
          <SelectIcon>
            <Icon as={ChevronDownIcon} />
          </SelectIcon>
        </View>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectScrollView>
            {(field.options || []).map(option => (
              <SelectItem label={option} value={option} key={option} />
            ))}
          </SelectScrollView>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

function Choice({
  label,
  picked,
  onPress,
}: {
  label: string;
  picked: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{flex: 1}}>
      <View
        py={'$3'}
        borderRadius={'$md'}
        borderWidth={picked ? 2 : 1}
        borderColor={picked ? theme.colors.primary.DEFAULT : '#CDD7EB'}
        bg={picked ? '#F2F6FB' : theme.colors.primary.white}
        alignItems={'center'}>
        <Text
          fontFamily={theme.fontFamily.medium}
          color={picked ? theme.colors.primary.DEFAULT : theme.colors.grey[200]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function YesNoField({value, onChange}: TFieldProps) {
  return (
    <HStack space={'md'}>
      <Choice label={'Yes'} picked={value === true} onPress={() => onChange(true)} />
      <Choice label={'No'} picked={value === false} onPress={() => onChange(false)} />
    </HStack>
  );
}

function LocationField({value, onChange, upload, check}: TFieldProps) {
  const [busy, setBusy] = useState(false);
  const capture = () => {
    setBusy(true);
    Geolocation.getCurrentPosition(
      pos => {
        setBusy(false);
        onChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          capturedAt: new Date(pos.timestamp || Date.now()).toISOString(),
        });
      },
      err => {
        setBusy(false);
        upload.error(
          'Location not found',
          err?.message || 'Turn on location and step outside, then try again.',
        );
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
    );
  };
  return (
    <VStack space={'sm'}>
      {value ? (
        <Text fontSize={'$sm'} color={theme.colors.grey.solid}>
          {Number(value.latitude).toFixed(6)}, {Number(value.longitude).toFixed(6)}
          {value.accuracy ? ` (±${Math.round(value.accuracy)} m)` : ''}
        </Text>
      ) : null}
      <CheckNote check={check} />
      <Button
        variant={'outline'}
        borderColor={theme.colors.primary.DEFAULT}
        onPress={capture}
        isDisabled={busy}>
        <ButtonText color={theme.colors.primary.DEFAULT}>
          {value ? 'Capture again here' : 'Capture my location here'}
        </ButtonText>
        {busy && <ButtonSpinner ml={'$1'} />}
      </Button>
    </VStack>
  );
}

function FilesField({field, value, onChange, upload}: TFieldProps) {
  const files: TFile[] = Array.isArray(value) ? value : [];
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const max = field.max || 20;
  const full = files.length >= max;
  const kind = field.kind || 'photo';
  const add = (file?: TFile) => file?.url && onChange([...files, file].slice(0, max));

  const picked = async (result: any) => {
    if (result?.errorCode) {
      upload.error(
        'Camera not available',
        result.errorCode === 'permission'
          ? 'Allow camera and photo access for CleCheck Agent in your phone settings.'
          : result.errorMessage,
      );
      return;
    }
    const assets = (result?.assets || []).slice(0, max - files.length);
    if (!assets.length) {
      return;
    }
    setBusy(true);
    const done: TFile[] = [];
    for (const asset of assets) {
      const isVideo = String(asset.type || '').startsWith('video');
      const url = isVideo
        ? await upload.video(asset.uri)
        : await upload.photo(asset.uri, asset.type);
      if (url) {
        done.push({
          url,
          type: isVideo ? 'video' : kind === 'document' ? 'document' : 'photo',
        });
      }
    }
    setBusy(false);
    if (done.length) {
      onChange([...files, ...done].slice(0, max));
    }
  };

  const photo = {mediaType: 'photo', quality: 0.8, maxWidth: 1600, maxHeight: 1600, saveToPhotos: false};
  const takePhoto = async () => picked(await launchCamera(photo as any));
  const takeVideo = async () =>
    picked(
      await launchCamera({
        mediaType: 'video',
        durationLimit: 30,
        videoQuality: 'low',
        saveToPhotos: false,
      } as any),
    );
  const fromPhone = async () =>
    picked(
      await launchImageLibrary({
        ...photo,
        mediaType: kind === 'media' || kind === 'video' ? 'mixed' : 'photo',
        selectionLimit: Math.max(1, max - files.length),
      } as any),
    );

  const toggleRecording = async () => {
    try {
      if (!recording) {
        await recorder.startRecorder();
        setRecording(true);
        return;
      }
      const path = await recorder.stopRecorder();
      recorder.removeRecordBackListener();
      setRecording(false);
      setBusy(true);
      const url = await upload.audio(formatFilePath(path) as string);
      setBusy(false);
      add(url ? {url, type: 'audio', name: 'Voice recording'} : undefined);
    } catch (e: any) {
      setRecording(false);
      setBusy(false);
      upload.error('Could not record', e?.message || 'Allow the microphone and try again.');
    }
  };

  return (
    <VStack space={'sm'}>
      <HStack flexWrap={'wrap'} gap={'$2'}>
        {files.map((f, i) => (
          <View key={`${f.url}-${i}`} position={'relative'}>
            {f.type === 'video' || f.type === 'audio' ? (
              <View
                w={72}
                h={72}
                borderRadius={'$md'}
                bg={'#EEF2F8'}
                alignItems={'center'}
                justifyContent={'center'}>
                <Text fontSize={'$xs'}>{f.type === 'video' ? 'Video' : 'Voice'}</Text>
              </View>
            ) : (
              <Image
                source={{uri: f.url}}
                alt={field.label}
                w={72}
                h={72}
                borderRadius={8}
              />
            )}
            <TouchableOpacity
              onPress={() => onChange(files.filter((_, j) => j !== i))}
              style={{position: 'absolute', top: -6, right: -6}}>
              <View bg={'#FFFFFF'} borderRadius={'$full'} p={'$0.5'}>
                <X width={16} height={16} color={'#D92D20'} />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </HStack>
      <Text fontSize={'$xs'} color={theme.colors.grey[300]}>
        {files.length} of {field.min ? `at least ${field.min}, ` : ''}up to {max}
      </Text>
      {!full && (
        <HStack space={'sm'} flexWrap={'wrap'}>
          {kind === 'audio' ? (
            <Button size={'sm'} variant={'outline'} onPress={toggleRecording} isDisabled={busy}>
              <ButtonText>{recording ? 'Stop and keep' : 'Record voice'}</ButtonText>
            </Button>
          ) : (
            <>
              {kind !== 'video' && (
                <Button size={'sm'} variant={'outline'} onPress={takePhoto} isDisabled={busy}>
                  <ButtonText>{kind === 'document' ? 'Snap document' : 'Take photo'}</ButtonText>
                </Button>
              )}
              {(kind === 'video' || kind === 'media') && (
                <Button size={'sm'} variant={'outline'} onPress={takeVideo} isDisabled={busy}>
                  <ButtonText>Record video</ButtonText>
                </Button>
              )}
              <Button size={'sm'} variant={'outline'} onPress={fromPhone} isDisabled={busy}>
                <ButtonText>From phone</ButtonText>
              </Button>
            </>
          )}
          {busy && <ButtonSpinner ml={'$1'} />}
        </HStack>
      )}
    </VStack>
  );
}

function SignatureField({value, onChange, upload}: TFieldProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<SignatureViewRef>(null);
  const keep = async (base64: string) => {
    setOpen(false);
    setBusy(true);
    try {
      const path = await convertBase64ToFile(base64);
      const url = path ? await upload.signature(path) : undefined;
      if (url) {
        onChange(url);
      }
    } catch (e: any) {
      upload.error('Signature not saved', e?.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <VStack space={'sm'}>
      {value ? (
        <Image
          source={{uri: value}}
          alt={'Signature'}
          w={'$full'}
          h={100}
          resizeMode={'contain'}
          bg={'#F7F7FF'}
          borderRadius={8}
        />
      ) : null}
      <Button
        variant={'outline'}
        borderColor={theme.colors.primary.DEFAULT}
        onPress={() => setOpen(true)}
        isDisabled={busy}>
        <ButtonText color={theme.colors.primary.DEFAULT}>
          {value ? 'Sign again' : 'Sign on the phone'}
        </ButtonText>
        {busy && <ButtonSpinner ml={'$1'} />}
      </Button>
      <Modal visible={open} animationType={'slide'} onRequestClose={() => setOpen(false)}>
        <View flex={1} p={'$4'} bg={'#FFFFFF'}>
          <Text fontFamily={theme.fontFamily.medium} fontSize={'$lg'} mb={'$2'}>
            Sign inside the box
          </Text>
          <View flex={1} borderWidth={1} borderStyle={'dashed'} borderColor={theme.colors.primary.DEFAULT}>
            <SignatureScreen
              ref={ref}
              onOK={keep}
              descriptionText=""
              backgroundColor={'#F7F7FF'}
              autoClear={false}
              webStyle={'.m-signature-pad--footer {display: none;}'}
            />
          </View>
          <HStack space={'md'} mt={'$3'}>
            <Button flex={1} variant={'outline'} onPress={() => ref.current?.clearSignature()}>
              <ButtonText>Clear</ButtonText>
            </Button>
            <Button flex={1} variant={'outline'} onPress={() => setOpen(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button flex={1} bg={theme.colors.primary.DEFAULT} onPress={() => ref.current?.readSignature()}>
              <ButtonText>Keep</ButtonText>
            </Button>
          </HStack>
        </View>
      </Modal>
    </VStack>
  );
}

function GroupField({field, value, onChange, upload, onDrawing}: TFieldProps) {
  const entries: any[] = Array.isArray(value) ? value : [];
  const max = field.max || 100;
  const one = field.label.replace(/s$/, '').toLowerCase();
  const setEntry = (i: number, key: string, v: any) =>
    onChange(entries.map((e, j) => (j === i ? {...e, [key]: v} : e)));
  return (
    <VStack space={'md'}>
      {entries.map((entry, i) => (
        <View key={i} p={'$3'} borderRadius={'$md'} borderWidth={1} borderColor={'#E4E7EC'}>
          <HStack justifyContent={'space-between'} alignItems={'center'} mb={'$2'}>
            <Text fontFamily={theme.fontFamily.medium} color={theme.colors.primary.DEFAULT}>
              {field.label.replace(/s$/, '')} {i + 1}
            </Text>
            <TouchableOpacity onPress={() => onChange(entries.filter((_, j) => j !== i))}>
              <Text color={'#D92D20'} fontSize={'$sm'}>
                Remove
              </Text>
            </TouchableOpacity>
          </HStack>
          <VStack space={'lg'}>
            {(field.fields || []).map(sub => (
              <OnsiteField
                key={sub.key}
                field={sub}
                value={entry?.[sub.key]}
                onChange={v => setEntry(i, sub.key, v)}
                upload={upload}
                onDrawing={onDrawing}
              />
            ))}
          </VStack>
        </View>
      ))}
      {entries.length < max && (
        <Button
          variant={'outline'}
          borderColor={theme.colors.primary.DEFAULT}
          onPress={() => onChange([...entries, {}])}>
          <ButtonText color={theme.colors.primary.DEFAULT}>
            {entries.length ? `Add another ${one}` : `Add ${one}`}
          </ButtonText>
        </Button>
      )}
    </VStack>
  );
}

export function OnsiteField(props: TFieldProps) {
  const {field} = props;
  const body = (() => {
    switch (field.type) {
      case 'date':
        return <DateField {...props} />;
      case 'select':
        return <SelectField {...props} />;
      case 'yesno':
        return <YesNoField {...props} />;
      case 'location':
        return <LocationField {...props} />;
      case 'files':
        return <FilesField {...props} />;
      case 'signature':
        return <SignatureField {...props} />;
      case 'group':
        return <GroupField {...props} />;
      default:
        return <TextField {...props} />;
    }
  })();
  return (
    <View>
      <Label field={field} />
      {body}
    </View>
  );
}
