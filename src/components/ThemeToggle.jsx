import { memo } from 'react';
import { SunIcon, MoonIcon } from './Icons.jsx';

export const ThemeToggle = memo(function ThemeToggle({ theme, onToggle }) {
  return (
    <div className="theme-toggle">
      <button className="theme-toggle__btn" onClick={onToggle} aria-label={theme === 'dark' ? 'Світла тема' : 'Темна тема'}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
});
