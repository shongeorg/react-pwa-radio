import { memo, useCallback } from 'react';
import { StationItem } from './StationItem.jsx';

export const StationList = memo(function StationList({
  stations,
  activeStation,
  isLoading,
  error,
  searchQuery,
  onSearchChange,
  onStationSelect,
  scrollContainerRef,
}) {
  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleKeyDown = useCallback((e, station) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onStationSelect(station);
    }
  }, [onStationSelect]);

  if (isLoading) {
    return <div className="station-list__loading">Завантаження...</div>;
  }

  if (error) {
    return <div className="station-list__empty">{error}</div>;
  }

  if (!stations || stations.length === 0) {
    return <div className="station-list__empty">Станції не знайдено</div>;
  }

  return (
    <div className="station-list__wrapper">
      {stations.length > 10 && (
        <div className="station-list__search">
          <input
            type="text"
            className="station-list__input"
            placeholder="Пошук станцій..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Пошук станцій"
          />
        </div>
      )}

      <div className="station-list__count">
        {stations.length} {stations.length === 1 ? 'станція' : stations.length < 5 ? 'станції' : 'станцій'}
      </div>

      <div ref={scrollContainerRef} className="station-list" role="listbox" aria-label="Список радіостанцій" tabIndex={0}>
        {stations.map((station, index) => (
          <StationItem
            key={station.stationuuid}
            station={station}
            index={index}
            isActive={activeStation?.stationuuid === station.stationuuid}
            onSelect={onStationSelect}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    </div>
  );
});
