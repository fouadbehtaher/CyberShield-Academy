import createNeoAuroraTheme from './neoAuroraTheme';
import createCosmicPulseTheme from './cosmicPulseTheme';
import createSolarFlareTheme from './solarFlareTheme';
import createMidnightMirageTheme from './midnightMirageTheme';
import createLuminousOasisTheme from './luminousOasisTheme';
import createLuminousMistTheme from './luminousMistTheme';
import createMidnightForgeTheme from './midnightForgeTheme';

const themeFactories = {
  'neo-aurora': createNeoAuroraTheme,
  'cosmic-pulse': createCosmicPulseTheme,
  'solar-flare': createSolarFlareTheme,
  'luminous-mist': createLuminousMistTheme,
  'midnight-forge': createMidnightForgeTheme,
  'midnight-mirage': createMidnightMirageTheme,
  'luminous-oasis': createLuminousOasisTheme,
};

export const AVAILABLE_THEME_VARIANTS = [
  { id: 'neo-aurora', label: 'Neo Aurora' },
  { id: 'cosmic-pulse', label: 'Cosmic Pulse' },
  { id: 'solar-flare', label: 'Solar Flare' },
  { id: 'luminous-mist', label: 'Luminous Mist' },
  { id: 'midnight-forge', label: 'Midnight Forge' },
  { id: 'midnight-mirage', label: 'Midnight Mirage' },
  { id: 'luminous-oasis', label: 'Luminous Oasis' },
];

export const getThemeByVariant = (variant) => {
  const factory = themeFactories[variant] ?? themeFactories['neo-aurora'];
  return factory();
};

export default getThemeByVariant;
