import { useCallback, useEffect } from 'react';
import { Player, StationList, ThemeToggle, NetworkStatus, ConnectionStatus, InstallPWA } from './components/index.js';
import { useTheme, useActiveStation, useAudio, useStations, useScrollToActive } from './hooks/index.js';
import './styles/index.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    stations,
    isLoading: stationsLoading,
    error: stationsError,
    searchQuery,
    setSearchQuery,
    filteredStations,
  } = useStations();

  const { activeStation, setActiveStation, volume, setVolume } = useActiveStation(stations);

  const {
    isPlaying,
    error: audioError,
    togglePlay,
    stop,
    play,
  } = useAudio(activeStation, volume);

  const { scrollContainerRef } = useScrollToActive(activeStation);

  useEffect(() => {
    if (!stations || stations.length === 0) return;
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const stationUuid = hash.slice(1);
      const foundStation = stations.find(s => s.stationuuid === stationUuid);
      if (foundStation) {
        setActiveStation(foundStation);
        setTimeout(() => play(), 200);
      }
    }
  }, [stations, setActiveStation, play]);

  const updateHash = useCallback((station) => {
    if (station?.stationuuid) {
      window.location.hash = station.stationuuid;
    }
  }, []);

  const handleStationSelect = useCallback((station) => {
    setActiveStation(station);
    updateHash(station);
    setTimeout(() => play(), 100);
  }, [setActiveStation, play, updateHash]);

  const handlePrevious = useCallback(() => {
    if (!stations || stations.length === 0 || !activeStation) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === activeStation.stationuuid);
    const previousIndex = currentIndex <= 0 ? stations.length - 1 : currentIndex - 1;
    const prevStation = stations[previousIndex];
    setActiveStation(prevStation);
    updateHash(prevStation);
  }, [stations, activeStation, setActiveStation, updateHash]);

  const handleNext = useCallback(() => {
    if (!stations || stations.length === 0 || !activeStation) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === activeStation.stationuuid);
    const nextIndex = currentIndex >= stations.length - 1 ? 0 : currentIndex + 1;
    const nextStation = stations[nextIndex];
    setActiveStation(nextStation);
    updateHash(nextStation);
  }, [stations, activeStation, setActiveStation, updateHash]);

  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
  }, [setVolume]);

  const handleShare = useCallback(async () => {
    if (!activeStation) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#${activeStation.stationuuid}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Українські Радіостанції',
          text: `Слухаю ${activeStation.name}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Посилання скопійовано!');
      } catch (error) {
        console.log('Error:', error);
      }
    }
  }, [activeStation]);

  const handleStop = useCallback(() => stop(), [stop]);

  return (
    <div className="app">
      <header className="app__header header">
        <h1 className="header__title">📻 Українське Радіо</h1>
        <div className="header__controls">
          <InstallPWA />
          <ConnectionStatus />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <div className="app__status-bar">
        <NetworkStatus />
      </div>

      <main className="app__main">
        <div className="app__content">
          <StationList
            stations={filteredStations}
            activeStation={activeStation}
            isLoading={stationsLoading}
            error={stationsError}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onStationSelect={handleStationSelect}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </main>

      <div className="app__player player">
        <Player
          activeStation={activeStation}
          isPlaying={isPlaying}
          volume={volume}
          onPlayPause={togglePlay}
          onStop={handleStop}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onVolumeChange={handleVolumeChange}
          onShare={handleShare}
          error={audioError}
        />
      </div>
    </div>
  );
}

export default App;
