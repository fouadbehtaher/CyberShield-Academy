import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'cs-admin-layout-settings';
const defaultSettings = {
  widthMode: 'wide',
  density: 'balanced',
  uiScale: 'standard',
  glassOverlay: true,
  sidebarVisible: true,
  headerVisible: true,
  uiEnhancements: 'advanced',
  themeVariant: 'neo-aurora',
};

const scaleMap = {
  compact: 0.94,
  standard: 1,
  expanded: 1.06,
  immersive: 1.12,
};

const densityPadding = {
  compact: { x: { xs: 2, md: 3 }, y: { xs: 9, md: 11 } },
  balanced: { x: { xs: 2.5, md: 5 }, y: { xs: 12, md: 14 } },
  relaxed: { x: { xs: 3.5, md: 6 }, y: { xs: 13, md: 16 } },
};

const LayoutSettingsContext = createContext({
  settings: defaultSettings,
  updateWidthMode: () => {},
  updateDensity: () => {},
  updateScale: () => {},
  toggleGlass: () => {},
  setSidebarVisible: () => {},
  setHeaderVisible: () => {},
  setUiEnhancements: () => {},
  setThemeVariant: () => {},
  derived: {
    scaleValue: 1,
    padding: densityPadding.balanced,
    maxWidth: 1720,
  },
});

const parseStoredSettings = (raw) => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch (error) {
    console.warn('Failed to parse layout settings, falling back to defaults.', error);
    return null;
  }
};

export const LayoutSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultSettings;
    }

    const stored = window.localStorage?.getItem(STORAGE_KEY);
    return parseStoredSettings(stored) ?? defaultSettings;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(settings));
    return undefined;
  }, [settings]);

  useEffect(() => {
    const html = document.documentElement;
    const scaleValue = scaleMap[settings.uiScale] ?? 1;
    html.style.setProperty('--cs-ui-scale', String(scaleValue));
    return () => {
      html.style.removeProperty('--cs-ui-scale');
    };
  }, [settings.uiScale]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-ui-mode', settings.uiEnhancements);
    return () => {
      html.removeAttribute('data-ui-mode');
    };
  }, [settings.uiEnhancements]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme-variant', settings.themeVariant);
    return () => {
      html.removeAttribute('data-theme-variant');
    };
  }, [settings.themeVariant]);

  const updateSetting = useCallback((key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const updateWidthMode = useCallback((mode) => {
    updateSetting('widthMode', mode);
  }, [updateSetting]);

  const updateDensity = useCallback((density) => {
    updateSetting('density', density);
  }, [updateSetting]);

  const updateScale = useCallback((scale) => {
    updateSetting('uiScale', scale);
  }, [updateSetting]);

  const toggleGlass = useCallback(() => {
    setSettings((current) => ({
      ...current,
      glassOverlay: !current.glassOverlay,
    }));
  }, []);

  const setSidebarVisible = useCallback((visible) => {
    setSettings((current) => ({
      ...current,
      sidebarVisible: visible,
    }));
  }, []);

  const setHeaderVisible = useCallback((visible) => {
    setSettings((current) => ({
      ...current,
      headerVisible: visible,
    }));
  }, []);

  const setUiEnhancements = useCallback((mode) => {
    setSettings((current) => ({
      ...current,
      uiEnhancements: mode,
    }));
  }, []);

  const setThemeVariant = useCallback((variant) => {
    setSettings((current) => ({
      ...current,
      themeVariant: variant,
    }));
  }, []);

  const derived = useMemo(() => {
    const scaleValue = scaleMap[settings.uiScale] ?? 1;
    const padding = densityPadding[settings.density] ?? densityPadding.balanced;

    const maxWidth = (() => {
      switch (settings.widthMode) {
        case 'boxed':
          return 1480;
        case 'fluid':
          return '100%';
        case 'wide':
        default:
          return 1720;
      }
    })();

    return {
      scaleValue,
      padding,
      maxWidth,
    };
  }, [settings.density, settings.uiScale, settings.widthMode]);

  const value = useMemo(() => ({
    settings,
    derived,
    updateWidthMode,
    updateDensity,
    updateScale,
    toggleGlass,
    setSidebarVisible,
    setHeaderVisible,
    setUiEnhancements,
    setThemeVariant,
  }), [settings, derived, updateWidthMode, updateDensity, updateScale, toggleGlass, setSidebarVisible, setHeaderVisible, setUiEnhancements, setThemeVariant]);

  return <LayoutSettingsContext.Provider value={value}>{children}</LayoutSettingsContext.Provider>;
};

LayoutSettingsProvider.propTypes = {
  children: PropTypes.node,
};

LayoutSettingsProvider.defaultProps = {
  children: null,
};

export const useLayoutSettings = () => useContext(LayoutSettingsContext);

export default useLayoutSettings;
