import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [connection, setConnection] = useState(navigator.connection);

  useEffect(() => {
    const updateConnectionStatus = () => {
      setConnection(navigator.connection);
    };

    connection.addEventListener("change", updateConnectionStatus);
    return () => {
      connection.removeEventListener("change", updateConnectionStatus);
    };
  }, [connection]);

  return (
    <div>
      <h3>Статус мережі:</h3>
      <p>Тип з'єднання: {connection.effectiveType}</p>
      <p>Швидкість завантаження: {connection.downlink} Mbps</p>
      <p>Число маркерів: {connection.rtt} ms</p>
    </div>
  );
}
