import React, { useCallback } from 'react';
import { Button, Select, Slider } from '@mantine/core';
import type { ControlPanelState, ControlUpdater } from './types';

interface GlobalControlsProps {
  state: ControlPanelState;
  onStateChange: ControlUpdater;
}

export const GlobalControls: React.FC<GlobalControlsProps> = ({ state, onStateChange }) => {
  const updateGlobalControl = useCallback(
    <K extends keyof ControlPanelState['globalControls']>(
      key: K,
      value: ControlPanelState['globalControls'][K]
    ) => {
      onStateChange(prev => ({
        ...prev,
        globalControls: {
          ...prev.globalControls,
          [key]: value
        }
      }));
    },
    [onStateChange]
  );

  return (
    <div className="global-controls">
      <div className="control-section">
        <h3>🕒 التحكم الزمني المتقدم</h3>
        <div className="control-group">
          <div className="control-item">
            <label>معدل الزمن: {state.globalControls.timeScale.toFixed(1)}x</label>
            <Slider
              value={state.globalControls.timeScale}
              onChange={value => updateGlobalControl('timeScale', value)}
              min={0.1}
              max={10}
              step={0.1}
              marks={[
                { value: 0.1, label: '0.1x' },
                { value: 1, label: '1x' },
                { value: 5, label: '5x' },
                { value: 10, label: '10x' }
              ]}
            />
          </div>
          <div className="control-item">
            <label>سرعة المحاكاة: {state.globalControls.simulationSpeed.toFixed(2)}x</label>
            <Slider
              value={state.globalControls.simulationSpeed}
              onChange={value => updateGlobalControl('simulationSpeed', value)}
              min={0.25}
              max={4}
              step={0.25}
            />
          </div>
        </div>
      </div>

      <div className="control-section">
        <h3>🎮 تحكم الصعوبة والتحدي</h3>
        <div className="control-group">
          <div className="control-item">
            <label>مستوى الصعوبة: {state.globalControls.difficulty}/10</label>
            <Slider
              value={state.globalControls.difficulty}
              onChange={value => updateGlobalControl('difficulty', value)}
              min={1}
              max={10}
              marks={[
                { value: 1, label: 'سهل' },
                { value: 5, label: 'متوسط' },
                { value: 10, label: 'صعب جداً' }
              ]}
            />
          </div>

          <div className="control-item">
            <label>عدوانية الذكاء الاصطناعي: {state.globalControls.aiAggressiveness}/10</label>
            <Slider
              value={state.globalControls.aiAggressiveness}
              onChange={value => updateGlobalControl('aiAggressiveness', value)}
              min={1}
              max={10}
            />
          </div>
        </div>
      </div>

      <div className="control-section">
        <h3>⚡ إدارة الموارد والأداء</h3>
        <div className="control-group">
          <div className="control-item">
            <label>توزيع الموارد</label>
            <Select
              value={state.globalControls.resourceAllocation}
              onChange={value => {
                if (!value) {
                  return;
                }
                const mode = value as ControlPanelState['globalControls']['resourceAllocation'];
                updateGlobalControl('resourceAllocation', mode);
              }}
              data={[
                { value: 'performance', label: '🔄 تركيز على الأداء' },
                { value: 'quality', label: '🎨 تركيز على الجودة' },
                { value: 'balanced', label: '⚖️ متوازن' }
              ]}
              comboboxProps={{ withinPortal: true }}
            />
          </div>

          <div className="control-item">
            <label>جودة التصيير: {state.globalControls.renderingQuality}%</label>
            <Slider
              value={state.globalControls.renderingQuality}
              onChange={value => updateGlobalControl('renderingQuality', value)}
              min={25}
              max={100}
              step={5}
            />
          </div>
        </div>
      </div>

      <div className="quick-action-buttons">
        <Button
          variant="light"
          color="red"
          onClick={() => updateGlobalControl('timeScale', 0.1)}
        >
          ⏸️ تجميد الزمن
        </Button>
        <Button
          variant="light"
          color="green"
          onClick={() => updateGlobalControl('timeScale', 1)}
        >
          ▶️ زمن عادي
        </Button>
        <Button
          variant="light"
          color="blue"
          onClick={() =>
            onStateChange(prev => ({
              ...prev,
              globalControls: {
                ...prev.globalControls,
                difficulty: 10,
                aiAggressiveness: 10
              }
            }))
          }
        >
          💀 وضع التحدي القصوى
        </Button>
      </div>
    </div>
  );
};

export default GlobalControls;
