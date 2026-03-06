import { useEffect, useState, memo } from 'react';

export const NetworkStatus = memo(function NetworkStatus() {
  const [connection, setConnection] = useState(() => navigator.connection);

  useEffect(() => {
    if (!connection) return;
    const update = () => setConnection(navigator.connection);
    connection.addEventListener('change', update);
    return () => connection.removeEventListener('change', update);
  }, [connection]);

  if (!connection) return null;

  return (
    <div className="network-info" aria-label="Інформація про мережу">
      <span className="network-info__item"><span>{connection.effectiveType || 'N/A'}</span></span>
      <span className="network-info__item"><span>↓ {connection.downlink?.toFixed(1) || 'N/A'} Mbps</span></span>
      <span className="network-info__item"><span>⏱ {connection.rtt || 'N/A'} ms</span></span>
    </div>
  );
});
