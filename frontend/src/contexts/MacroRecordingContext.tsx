import React, { createContext, useCallback, useMemo, useState, ReactNode } from 'react';

export interface Macro {
  id: string;
  name: string;
  commands: string[];
}

type MacroSaveFailureReason = 'NAME_REQUIRED' | 'NO_COMMANDS_RECORDED' | 'NAME_CONFLICT';

export type SaveMacroResult =
  | { success: true; macro: Macro }
  | { success: false; reason: MacroSaveFailureReason };

interface MacroRecordingContextType {
  isRecording: boolean;
  recordedCommands: string[];
  macros: Macro[];
  startRecording: () => void;
  stopRecording: () => void;
  recordCommand: (command: string) => void;
  clearRecording: () => void;
  saveMacro: (name: string) => SaveMacroResult;
  deleteMacro: (id: string) => void;
}

const readMacros = (): Macro[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const stored = window.localStorage.getItem('macros');
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(item => typeof item?.id === 'string' && Array.isArray(item?.commands));
  } catch (error) {
    console.warn('Failed to read macros from storage', error);
    return [];
  }
};

const persistMacros = (macros: Macro[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem('macros', JSON.stringify(macros));
  } catch (error) {
    console.warn('Failed to persist macros', error);
  }
};

export const MacroRecordingContext = createContext<MacroRecordingContextType | undefined>(undefined);

const generateMacroId = () => `macro-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const MacroRecordingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedCommands, setRecordedCommands] = useState<string[]>([]);
  const [macros, setMacros] = useState<Macro[]>(() => readMacros());

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordedCommands([]);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  const recordCommand = useCallback((command: string) => {
    if (!isRecording) {
      return;
    }
    setRecordedCommands(prev => [...prev, command]);
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setRecordedCommands([]);
    setIsRecording(false);
  }, []);

  const saveMacro = useCallback((name: string): SaveMacroResult => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, reason: 'NAME_REQUIRED' };
    }
    if (recordedCommands.length === 0) {
      return { success: false, reason: 'NO_COMMANDS_RECORDED' };
    }
    if (macros.some(macro => macro.name.toLowerCase() === trimmedName.toLowerCase())) {
      return { success: false, reason: 'NAME_CONFLICT' };
    }

    const newMacro: Macro = {
      id: generateMacroId(),
      name: trimmedName,
      commands: [...recordedCommands],
    };

    setMacros(prev => {
      const next = [...prev, newMacro];
      persistMacros(next);
      return next;
    });
    setRecordedCommands([]);
    setIsRecording(false);
    return { success: true, macro: newMacro };
  }, [macros, recordedCommands]);

  const deleteMacro = useCallback((id: string) => {
    setMacros(prev => {
      const next = prev.filter(macro => macro.id !== id);
      persistMacros(next);
      return next;
    });
  }, []);

  const contextValue = useMemo<MacroRecordingContextType>(() => ({
    isRecording,
    recordedCommands,
    macros,
    startRecording,
    stopRecording,
    recordCommand,
    clearRecording,
    saveMacro,
    deleteMacro,
  }), [isRecording, recordedCommands, macros, startRecording, stopRecording, recordCommand, clearRecording, saveMacro, deleteMacro]);

  return (
    <MacroRecordingContext.Provider value={contextValue}>
      {children}
    </MacroRecordingContext.Provider>
  );
};
