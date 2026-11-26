import React, { Suspense, lazy, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './app.css';
import { MacroRecordingProvider } from './contexts/MacroRecordingContext';
import { InjectionProvider } from './core/architecture/container';

// Entry point that mounts two existing views. It adds no new features and
// no server routes. Both views call /api/* endpoints that this repository's
// backend does not implement yet, so data panels stay empty until it does.
const MasterControlPanel = lazy(() => import('./components/control-panel/MasterControlPanel'));
const CyberCityScene = lazy(() => import('./pages/virtual-world/CyberCityScene'));

type View = 'control-panel' | 'cyber-city';

const App: React.FC = () => {
  const [view, setView] = useState<View>(window.location.hash === '#cyber-city' ? 'cyber-city' : 'control-panel');
  return (
    <MantineProvider>
    <InjectionProvider>
      <nav className="app-nav">
        <button className={view === 'control-panel' ? 'active' : ''} onClick={() => { window.location.hash = 'control-panel'; setView('control-panel'); }}>Control panel</button>
        <button className={view === 'cyber-city' ? 'active' : ''} onClick={() => { window.location.hash = 'cyber-city'; setView('cyber-city'); }}>Cyber city (3D)</button>
      </nav>
      <p className="app-note">Preview shell: no backend is connected, so panels show local default state only.</p>
      <Suspense fallback={<p>Loading...</p>}>
        {view === 'control-panel' ? (
          <div dir="rtl" className="app-panel">
            <MacroRecordingProvider>
              <MasterControlPanel />
            </MacroRecordingProvider>
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 90px)' }}>
            <CyberCityScene />
          </div>
        )}
      </Suspense>
    </InjectionProvider>
    </MantineProvider>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
