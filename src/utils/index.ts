import {Linking} from 'react-native';

export const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

export const openGoogleMap = async (data: string) => {
  if (!data) {
    return;
  }

  Linking.openURL(data);
};
