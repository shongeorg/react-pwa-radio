import { useState, useEffect, useCallback } from 'react';

const ACTIVE_STATION_STORAGE_KEY = 'radio-active-station';
const VOLUME_STORAGE_KEY = 'radio-volume';

const DEFAULT_VOLUME = 0.8;

/**
 * Custom hook for managing active station with LocalStorage persistence
 * @param {Array} stations - Array of station objects
 * @returns {{ activeStation: object|null, setActiveStation: (station) => void, volume: number, setVolume: (volume: number) => void }}
 */
export function useActiveStation(stations) {
  const [activeStation, setActiveStationState] = useState(null);
  const [volume, setVolumeState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
      if (storedVolume !== null) {
        const parsed = parseFloat(storedVolume);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          return parsed;
        }
      }
    }
    return DEFAULT_VOLUME;
  });

  // Set active station from localStorage on mount or when stations change
  useEffect(() => {
    if (!stations || stations.length === 0) return;

    const storedStationUuid = localStorage.getItem(ACTIVE_STATION_STORAGE_KEY);
    
    if (storedStationUuid) {
      const foundStation = stations.find(
        (station) => station.stationuuid === storedStationUuid
      );
      if (foundStation) {
        setActiveStationState(foundStation);
        return;
      }
    }

    // Fallback to first station if no valid stored station
    setActiveStationState(stations[0]);
  }, [stations]);

  const setActiveStation = useCallback((station) => {
    if (!station) return;
    
    setActiveStationState(station);
    if (typeof window !== 'undefined' && window.localStorage && station.stationuuid) {
      localStorage.setItem(ACTIVE_STATION_STORAGE_KEY, station.stationuuid);
    }
  }, []);

  const setVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(VOLUME_STORAGE_KEY, clampedVolume.toString());
    }
  }, []);

  return { activeStation, setActiveStation, volume, setVolume };
}
