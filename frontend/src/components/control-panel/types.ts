import type { Dispatch, SetStateAction } from 'react';

type ResourceAllocationMode = 'performance' | 'quality' | 'balanced';
type NetworkTopology = 'simple' | 'complex' | 'enterprise';
type TrainingPhase = 'idle' | 'training' | 'evaluating';

export interface ControlPanelState {
  globalControls: {
    timeScale: number;
    difficulty: number;
    aiAggressiveness: number;
    resourceAllocation: ResourceAllocationMode;
    simulationSpeed: number;
    renderingQuality: number;
  };
  userManagement: {
    activeFilters: string[];
    bulkActions: string[];
    realTimeMonitoring: boolean;
    automatedInterventions: boolean;
  };
  aiSystems: {
    modelVersions: Map<string, string>;
    trainingStatus: Map<string, TrainingPhase>;
    performanceMetrics: Map<string, number>;
    adaptiveLearning: boolean;
  };
  simulationEnvironment: {
    activeScenarios: Set<string>;
    networkTopology: NetworkTopology;
    threatLevel: number;
    autoResponse: boolean;
  };
}

export type TabKey = 'global' | 'users' | 'ai' | 'simulation' | 'analytics';

export type ControlUpdater = Dispatch<SetStateAction<ControlPanelState>>;

export interface CommandAnalytics {
  commandCount: number;
  lastCommand: string | null;
}

export const createDefaultControlPanelState = (): ControlPanelState => ({
  globalControls: {
    timeScale: 1,
    difficulty: 5,
    aiAggressiveness: 3,
    resourceAllocation: 'balanced',
    simulationSpeed: 1,
    renderingQuality: 100
  },
  userManagement: {
    activeFilters: [],
    bulkActions: [],
    realTimeMonitoring: true,
    automatedInterventions: true
  },
  aiSystems: {
    modelVersions: new Map(),
    trainingStatus: new Map(),
    performanceMetrics: new Map(),
    adaptiveLearning: true
  },
  simulationEnvironment: {
    activeScenarios: new Set(),
    networkTopology: 'complex',
    threatLevel: 3,
    autoResponse: true
  }
});
