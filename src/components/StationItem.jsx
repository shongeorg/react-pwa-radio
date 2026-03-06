import { memo, useCallback, useEffect, useRef } from 'react';

export const StationItem = memo(function StationItem({ station, index, isActive, onSelect, onKeyDown }) {
  const handleClick = useCallback(() => onSelect(station), [station, onSelect]);
  const stationName = station.name ? station.name.replace(/_/g, ' ').replace(/  +/g, ' ') : 'Невідомо';
  const itemRef = useRef(null);

  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isActive]);

  return (
    <div
      ref={itemRef}
      className={`station-card${isActive ? ' station-card--active' : ''}`}
      data-station-uuid={station.stationuuid}
      role="option"
      aria-selected={isActive}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => onKeyDown(e, station)}
    >
      <span className="station-card__index">{index + 1}</span>
      <span className={`station-card__indicator${isActive ? ' station-card__indicator--visible' : ''}`} aria-hidden="true" />
      <div className="station-card__content">
        <h3 className="station-card__name" title={stationName}>{stationName}</h3>
        {station.tags && <p className="station-card__meta">{station.tags.split(',').slice(0, 3).join(' • ')}</p>}
      </div>
    </div>
  );
});
