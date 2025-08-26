import React, { useState, useCallback } from 'react';
import Video, { VideoRef } from 'react-native-video';
import { getVideoProps, getOptimalVideoQuality } from './videoConfig';

interface OptimizedVideoProps {
  source: { uri: string };
  style: any;
  poster?: string;
  onLoad?: (data: any) => void;
  onEnd?: () => void;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  repeat?: boolean;
  muted?: boolean;
  paused?: boolean;
}

export const OptimizedVideo = React.forwardRef<VideoRef, OptimizedVideoProps>(
  (
    {
      source,
      style,
      poster,
      onLoad,
      onEnd,
      resizeMode = 'cover',
      repeat = true,
      muted = true,
      paused = false,
    },
    ref,
  ) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleVideoLoad = useCallback(
      (data: any) => {
        setIsLoaded(true);
        onLoad?.(data);
      },
      [onLoad],
    );

    const videoProps = getVideoProps();
    const qualitySettings = getOptimalVideoQuality();

    return (
      <Video
        ref={ref}
        source={source}
        style={style}
        poster={poster}
        onLoad={handleVideoLoad}
        onEnd={onEnd}
        paused={paused || !isLoaded}
        {...videoProps}
        {...qualitySettings}
        resizeMode={resizeMode}
        repeat={repeat}
        muted={muted}
      />
    );
  },
);

OptimizedVideo.displayName = 'OptimizedVideo';
