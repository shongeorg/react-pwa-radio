export function Station({ station, active, onClick }) {
  return (
    <div
      className={`station-list-item ${
        station.stationuuid === active.stationuuid ? "active" : ""
      }`}
      onClick={onClick}
    >
      <h4>{station.name}</h4>
    </div>
  );
}
