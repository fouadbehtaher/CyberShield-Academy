import React, { useMemo, useState } from 'react';
import { Macro, SaveMacroResult } from '../../contexts/MacroRecordingContext';
import { useMacroRecording } from '../../hooks/useMacroRecording';

interface MacroSystemProps {
  onMacroExecute: (commands: string[]) => void;
}

const getErrorMessage = (result: SaveMacroResult): string => {
  if ('reason' in result) {
    switch (result.reason) {
      case 'NAME_REQUIRED':
        return 'Please provide a name for the macro.';
      case 'NO_COMMANDS_RECORDED':
        return 'No commands recorded. Execute actions while recording to capture them.';
      case 'NAME_CONFLICT':
        return 'A macro with this name already exists. Choose a different name.';
      default:
        return 'Unable to save the macro.';
    }
  }

  return 'Macro saved successfully.';
};

export const MacroSystem: React.FC<MacroSystemProps> = ({ onMacroExecute }) => {
  const {
    macros,
    isRecording,
    recordedCommands,
    startRecording,
    stopRecording,
    clearRecording,
    saveMacro,
    deleteMacro
  } = useMacroRecording();

  const [macroName, setMacroName] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const hasRecording = recordedCommands.length > 0;

  const sortedMacros = useMemo(
    () => [...macros].sort((a, b) => a.name.localeCompare(b.name)),
    [macros]
  );

  const handleSaveMacro = () => {
    const result = saveMacro(macroName);
    if (result.success) {
      setStatusMessage(`Macro "${result.macro.name}" saved successfully.`);
      setMacroName('');
      return;
    }

    setStatusMessage(getErrorMessage(result));
  };

  const handleExecuteMacro = (macro: Macro) => {
    if (!macro.commands.length) {
      setStatusMessage('This macro does not contain any commands.');
      return;
    }
    onMacroExecute(macro.commands);
    setStatusMessage(`Executed macro "${macro.name}".`);
  };

  return (
    <section className="macro-system">
      <header className="macro-system__header">
        <h3>Macro System</h3>
        <div className="macro-system__recording-controls">
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          {hasRecording && !isRecording ? (
            <button onClick={clearRecording}>Discard Recording</button>
          ) : null}
        </div>
      </header>

      {isRecording ? (
        <div className="macro-system__recording-indicator">
          Recording… captured commands: {recordedCommands.length}
        </div>
      ) : null}

      {!isRecording && hasRecording ? (
        <div className="macro-system__save">
          <input
            type="text"
            placeholder="Enter macro name"
            value={macroName}
            onChange={event => setMacroName(event.target.value)}
          />
          <button onClick={handleSaveMacro}>Save Macro</button>
        </div>
      ) : null}

      {statusMessage ? <div className="macro-system__status">{statusMessage}</div> : null}

      <div className="macro-system__list">
        <h4>Saved Macros</h4>
        {sortedMacros.length === 0 ? (
          <p>No macros available yet.</p>
        ) : (
          <ul>
            {sortedMacros.map(macro => (
              <li key={macro.id} className="macro-system__item">
                <div className="macro-system__item-info">
                  <strong>{macro.name}</strong>
                  <span>{macro.commands.length} commands</span>
                </div>
                <div className="macro-system__item-actions">
                  <button onClick={() => handleExecuteMacro(macro)}>Execute</button>
                  <button onClick={() => deleteMacro(macro.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MacroSystem;
