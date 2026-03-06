import { memo } from 'react';
import './PWABadge.css';

export const PWABadge = memo(function PWABadge() {
  return <div className="pwa-badge" role="alert" aria-live="polite" />;
});
