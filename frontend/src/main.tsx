import React, { Suspense, lazy, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InjectionProvider } from './core/architecture/container';

// Entry point that mounts two existing views. It adds no new features and
// no server routes. Both views call /api/* endpoints that this repository's
// backend does not implement yet, so data panels stay empty until it does.
const MasterControlPanel = lazy(() => import('./components/control-panel/MasterControlPanel'));
const CyberCityScene = lazy(() => import('./pages/virtual-world/CyberCityScene'));

type View = 'control-panel' | 'cyber-city';

const App: React.FC = () => {
  const [view, setView] = useState<View>('control-panel');
  return (
    <InjectionProvider>
      <nav style={{ display: 'flex', gap: 8, padding: 8 }}>
        <button onClick={() => setView('control-panel')}>Control panel</button>
        <button onClick={() => setView('cyber-city')}>Cyber city (3D)</button>
      </nav>
      <Suspense fallback={<p>Loading...</p>}>
        {view === 'control-panel' ? <MasterControlPanel /> : <CyberCityScene />}
      </Suspense>
    </InjectionProvider>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
