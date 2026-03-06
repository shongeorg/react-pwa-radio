import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE_URL = 'https://de1.api.radio-browser.info/json/stations/bycountry/Ukraine';

/**
 * Custom hook for fetching and managing radio stations
 * @param {string} country - Country code or name for filtering stations
 * @returns {{ stations: Array, isLoading: boolean, error: string|null, searchQuery: string, setSearchQuery: (query: string) => void, filteredStations: Array }}
 */
export function useStations(country = 'Ukraine') {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch stations on mount
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_BASE_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Sort stations by name and add index
        const sortedStations = data
          .filter((station) => station.url_resolved)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((station, index) => ({
            ...station,
            _index: index,
          }));

        setStations(sortedStations);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        setError('Не вдалося завантажити станції. Перевірте підключення до інтернету.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [country]);

  // Filter stations based on search query
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) {
      return stations;
    }

    const query = searchQuery.toLowerCase().trim();
    return stations.filter((station) =>
      station.name.toLowerCase().includes(query) ||
      (station.tags && station.tags.toLowerCase().includes(query))
    );
  }, [stations, searchQuery]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return {
    stations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery: handleSearchChange,
    filteredStations,
  };
}
