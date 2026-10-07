declare module 'react-native-config' {
  export interface NativeConfig {
    [key: string]: ClientOptions<CorePlugins>;
  }

  export const Config: NativeConfig;
  export default Config;
}
