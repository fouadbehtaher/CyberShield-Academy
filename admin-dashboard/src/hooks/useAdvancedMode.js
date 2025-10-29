import { useMemo } from 'react';
import { useLayoutSettings } from './useLayoutSettings.jsx';

const useAdvancedMode = () => {
  const { settings } = useLayoutSettings();

  return useMemo(() => settings.uiEnhancements === 'advanced', [settings.uiEnhancements]);
};

export default useAdvancedMode;
