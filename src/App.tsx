import React, { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Navigation from './router/Navigation';
import { GlobalTheme } from './context/ThemeProvider';

function App() {
  const { theme } = GlobalTheme();

  // Sync data-theme attribute with the STRIDE CSS custom property system
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)', color: 'var(--color-fg-primary)', transition: 'background-color 220ms' }}>
      <Navbar />
      <Navigation />
    </div>
  );
}

export default App;
