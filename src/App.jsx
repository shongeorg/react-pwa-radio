import { useState, useEffect } from "react";
import PWABadge from "./PWABadge.jsx";
import "./App.css"; // Переконайтесь, що стиль для Houdini реалізований тут
import { Station } from "./Station.jsx";
import { ConnectionStatus } from "./ConnectionStatus.jsx";
import { NetworkStatus } from "./NetworkStatus.jsx";

function App() {
  const [stations, setStations] = useState([]);
  const [active, setActive] = useState(null);
  const [audio, setAudio] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audioData, setAudioData] = useState(new Uint8Array(256));

  useEffect(() => {
    if (CSS.paintWorklet) {
      CSS.paintWorklet.addModule("AudioVisualizer.js");
    }
  }, []);

  useEffect(() => {
    fetch("https://de1.api.radio-browser.info/json/stations/bycountry/Ukraine")
      .then((response) => response.json())
      .then((data) => {
        setStations(data);
        setActive(data[0]);
      });
  }, []);

  useEffect(() => {
    if (active && audio) {
      audio.pause();
    }

    const newAudio = new Audio(active?.url_resolved);
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      setAudio(null);
    };
  }, [active]);

  useEffect(() => {
    if (audio) {
      const newAudioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const newAnalyser = newAudioContext.createAnalyser();
      newAnalyser.fftSize = 256;

      const source = newAudioContext.createMediaElementSource(audio);
      source.connect(newAnalyser);
      newAnalyser.connect(newAudioContext.destination);

      setAudioContext(newAudioContext);
      setAnalyser(newAnalyser);

      audio.play();
      newAudioContext.resume();

      const dataArray = new Uint8Array(newAnalyser.frequencyBinCount);

      const updateAudioData = () => {
        newAnalyser.getByteFrequencyData(dataArray);
        setAudioData([...dataArray]);
        document.body.style.setProperty(
          "--audio-data",
          JSON.stringify(dataArray)
        );
        requestAnimationFrame(updateAudioData);
      };

      updateAudioData();
    }
  }, [audio]);

  const handleStationChange = (station) => {
    setActive(station);
    if (audio) {
      audio.pause();
    }
    audio.src = station.url_resolved;
    audio.load();
    audio.play();
  };

  const sharedHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Ukraine Radio stations",
          text: "Ukraine Radio stations",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  return (
    <>
      <ConnectionStatus />
      <NetworkStatus />
      <h1>Ukraine Radio stations: {active?.name}</h1>
      <div className="player">
        <input
          type="range"
          min={0}
          max={1}
          value={active?.volume}
          onChange={(e) => (audio.volume = e.target.value)}
          step={0.01}
        />
        <button onClick={sharedHandler}>shared</button>
      </div>
      <div className="stations-list">
        {stations.map((station) => (
          <Station
            key={station.stationuuid}
            station={station}
            active={active}
            onClick={() => handleStationChange(station)}
          />
        ))}
      </div>
      <PWABadge />
    </>
  );
}

export default App;
