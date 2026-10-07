import RNFS from 'react-native-fs';

export async function convertBase64ToFile(base64Data: any) {
  if (!base64Data) {
    return;
  }
  const splitBase64 = base64Data.split(',');
  const metadata = splitBase64[0];
  const data = splitBase64[1];

  if (!metadata.startsWith('data:') || !data) {
    throw new Error('Invalid base64 string format');
  }

  const filename = `signatory_${
    Date.now() + '-' + Math.round(Math.random() * 1e9)
  }.jpg`;
  const path = `file://${RNFS.CachesDirectoryPath}/${filename}`;

  await RNFS.writeFile(path, data, 'base64');

  return path;
}

export const formatFilePath = (path: any) => {
  if (!path) {
    return;
  }
  if (path.startsWith('file:////')) {
    return path.replace('file:////', 'file:///');
  }
  return path;
};

export const clearCache = async () => {
  try {
    const cacheDir = RNFS.CachesDirectoryPath;
    const files = await RNFS.readDir(cacheDir);

    // Filter images and audio files if needed
    const mediaFiles = files.filter(
      file =>
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.mp4') ||
        file.name.endsWith('.mp3') ||
        file.name.endsWith('.m4a'),
    );

    for (const file of mediaFiles) {
      await RNFS.unlink(file.path);
    }
  } catch (error) {
    return error;
  }
};
