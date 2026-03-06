import { memo, useCallback } from 'react';
import {
  PlayIcon, PauseIcon, StopIcon,
  SkipPreviousIcon, SkipNextIcon,
  VolumeUpIcon, VolumeMuteIcon, VolumeOffIcon,
  ShareIcon
} from './Icons.jsx';

export const Player = memo(function Player({
  activeStation,
  isPlaying,
  volume,
  onPlayPause,
  onStop,
  onPrevious,
  onNext,
  onVolumeChange,
  onShare,
  error,
}) {
  const handleVolumeChange = useCallback((e) => {
    onVolumeChange(parseFloat(e.target.value));
  }, [onVolumeChange]);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeOffIcon />;
    if (volume < 0.5) return <VolumeMuteIcon />;
    return <VolumeUpIcon />;
  };

  const formatName = (name) => name ? name.replace(/_/g, ' ').replace(/  +/g, ' ') : 'Невідомо';

  return (
    <>
      <div className="player__controls">
        <button className="player__btn" onClick={onPrevious} disabled={!activeStation} aria-label="Попередня">
          <SkipPreviousIcon />
        </button>
        <button className="player__btn player__btn-primary" onClick={onPlayPause} disabled={!activeStation || !!error} aria-label={isPlaying ? 'Пауза' : 'Відтворити'}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="player__btn" onClick={onStop} disabled={!activeStation || !!error} aria-label="Зупинити">
          <StopIcon />
        </button>
        <button className="player__btn" onClick={onNext} disabled={!activeStation} aria-label="Наступна">
          <SkipNextIcon />
        </button>
      </div>

      <div className="player__info">
        <div className="player__track-info">
          <h2 className="player__station-name">{activeStation ? formatName(activeStation.name) : '...'}</h2>
          <div className="player__status">
            {isPlaying && (<><span className="player__indicator" /><span>В ефірі</span></>)}
            {!isPlaying && activeStation && <span>На паузі</span>}
            {error && <span className="player__error">{error}</span>}
          </div>
        </div>
        <div className="player__volume">
          <span className="player__volume-icon">{getVolumeIcon()}</span>
          <input type="range" className="player__volume-slider" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} aria-label="Гучність" />
        </div>
      </div>

      <div className="player__actions">
        <button className="player__action-btn" onClick={onShare} disabled={!activeStation} aria-label="Поділитися">
          <ShareIcon />
        </button>
      </div>
    </>
  );
});
