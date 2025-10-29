import React, { useState } from 'react';
import { GlobalControls } from './GlobalControls';
import { UserManagementPanel } from './UserManagementPanel';
import { AIControlPanel } from './AIControlPanel';
import { SimulationControlPanel } from './SimulationControlPanel';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { MacroSystem } from './MacroSystem';
import { createDefaultControlPanelState, ControlPanelState } from './types';

export const MasterControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'users' | 'ai' | 'simulation' | 'analytics' | 'macros'>('global');
  const [state, setState] = useState<ControlPanelState>(createDefaultControlPanelState);

  const handleMacroExecute = (commands: string[]) => {
    commands.forEach(command => {
      console.log('Executing command:', command);
      executeCommand(command);
    });
  };

  const executeCommand = (command: string) => {
    switch (command) {
      case 'start_simulation':
        break;
      case 'stop_simulation':
        break;
      default:
        console.warn(`Unknown command: ${command}`);
    }
  };

  return (
    <div className="master-control-panel">
      <div className="tabs">
        <button onClick={() => setActiveTab('global')}>Global</button>
        <button onClick={() => setActiveTab('users')}>Users</button>
        <button onClick={() => setActiveTab('ai')}>AI</button>
        <button onClick={() => setActiveTab('simulation')}>Simulation</button>
        <button onClick={() => setActiveTab('analytics')}>Analytics</button>
        <button onClick={() => setActiveTab('macros')}>Macros</button>
      </div>
      <div className="tab-content">
        {activeTab === 'global' && <GlobalControls state={state} onStateChange={setState} />}
        {activeTab === 'users' && <UserManagementPanel state={state} onStateChange={setState} />}
        {activeTab === 'ai' && <AIControlPanel state={state} onStateChange={setState} />}
        {activeTab === 'simulation' && <SimulationControlPanel state={state} onStateChange={setState} />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'macros' && <MacroSystem onMacroExecute={handleMacroExecute} />}
      </div>
    </div>
  );
};

export default MasterControlPanel;
