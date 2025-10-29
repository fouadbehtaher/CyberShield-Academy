import { useContext } from 'react';
import { MacroRecordingContext } from '../contexts/MacroRecordingContext';

export const useMacroRecording = () => {
  const context = useContext(MacroRecordingContext);
  if (!context) {
    throw new Error('useMacroRecording must be used within a MacroRecordingProvider');
  }
  return context;
};
