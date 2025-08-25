import { useState, useCallback } from 'react';

export interface VideoState {
  durations: Map<number, number>;
  loadedVideos: Set<number>;
}

export const useVideoManager = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    durations: new Map(),
    loadedVideos: new Set(),
  });

  const handleVideoLoad = useCallback((index: number, data: any) => {
    setVideoState(prev => ({
      durations: new Map(prev.durations).set(index, data.duration || 5),
      loadedVideos: new Set(prev.loadedVideos).add(index),
    }));
  }, []);

  const getVideoDuration = useCallback((index: number): number => {
    return videoState.durations.get(index) || 5;
  }, [videoState.durations]);

  const isVideoLoaded = useCallback((index: number): boolean => {
    return videoState.loadedVideos.has(index);
  }, [videoState.loadedVideos]);

  return {
    handleVideoLoad,
    getVideoDuration,
    isVideoLoaded,
  };
};
