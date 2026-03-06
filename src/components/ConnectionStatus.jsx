import { useEffect, useState, memo } from 'react';

export const ConnectionStatus = memo(function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`status status--${isOnline ? 'online' : 'offline'}`} role="status" aria-live="polite">
      <span className="status__indicator" aria-hidden="true" />
      <span className="status__text">{isOnline ? 'Онлайн' : 'Офлайн'}</span>
    </div>
  );
});
