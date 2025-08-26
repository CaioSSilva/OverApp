import { Platform } from 'react-native';

export const videoConfig = {
  android: {
    bufferConfig: {
      minBufferMs: 1000,
      maxBufferMs: 5000,
      bufferForPlaybackMs: 500,
      bufferForPlaybackAfterRebufferMs: 1000,
    },
    useTextureView: true,
    hideShutterView: true,
    controls: false,
    disableFocus: true,
    mixWithOthers: 'mix' as const,
    ignoreSilentSwitch: 'ignore' as const,
    playInBackground: false,
    playWhenInactive: false,
    maxBitRate: 2000000,
    reportBandwidth: false,
  },
  ios: {
    playInBackground: false,
    playWhenInactive: false,
    ignoreSilentSwitch: 'ignore' as const,
    mixWithOthers: 'mix' as const,
  },
  common: {
    resizeMode: 'cover' as const,
    repeat: true,
    muted: true,
    controls: false,
    disableFocus: true,
  },
};

export const getVideoProps = () => {
  const platformConfig =
    Platform.OS === 'android' ? videoConfig.android : videoConfig.ios;
  return {
    ...videoConfig.common,
    ...platformConfig,
  };
};

export const videoQualityPresets = {
  high: {
    maxBitRate: 3000000,
  },
  medium: {
    maxBitRate: 2000000,
  },
  low: {
    maxBitRate: 1000000,
  },
};

export const getOptimalVideoQuality = () => {
  return videoQualityPresets.medium;
};
