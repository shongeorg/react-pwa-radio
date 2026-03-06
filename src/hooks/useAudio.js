import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing audio playback
 * @param {object} activeStation - Current active station object
 * @param {number} volume - Volume level (0-1)
 * @returns {{ isPlaying: boolean, isLoading: boolean, error: string|null, play: () => void, pause: () => void, stop: () => void, togglePlay: () => void, audioRef: object }}
 */
export function useAudio(activeStation, volume) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousStationRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'none';
    }

    const audio = audioRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      setError('Помилка відтворення станції');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Handle station change
  useEffect(() => {
    if (!activeStation || !audioRef.current) return;

    const audio = audioRef.current;
    const isSameStation = previousStationRef.current?.stationuuid === activeStation.stationuuid;

    // Only reload if station changed
    if (!isSameStation || !audio.src) {
      setIsLoading(true);
      setError(null);
      audio.src = activeStation.url_resolved;
      audio.load();
      previousStationRef.current = activeStation;
    }
  }, [activeStation]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback(() => {
    if (!audioRef.current || !activeStation) return;
    
    setIsLoading(true);
    audioRef.current
      .play()
      .catch((err) => {
        console.error('Playback error:', err);
        setError('Не вдалося відтворити аудіо');
        setIsLoading(false);
        setIsPlaying(false);
      });
  }, [activeStation]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  return {
    isPlaying,
    isLoading,
    error,
    play,
    pause,
    stop,
    togglePlay,
    audioRef,
  };
}
