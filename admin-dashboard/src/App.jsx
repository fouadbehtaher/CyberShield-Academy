import React, { useMemo } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { AppLayout } from './components/layout';
import {
  Dashboard,
  AIControl,
  Simulations,
  CourseCatalog,
  AnalyticsOverview,
  UserManagement,
  SecuritySettings,
  LearnerLogin,
  NotFound,
  ExperienceShowcase,
} from './pages';
import { LayoutSettingsProvider, useLayoutSettings } from './hooks/useLayoutSettings.jsx';
import { getThemeByVariant } from './styles/themes';

const pageTransition = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.98 },
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={pageTransition.initial}
    animate={pageTransition.animate}
    exit={pageTransition.exit}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    style={{ minHeight: '100%' }}
  >
    {children}
  </motion.div>
);

const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="users" element={<PageWrapper><UserManagement /></PageWrapper>} />
          <Route path="simulations" element={<PageWrapper><Simulations /></PageWrapper>} />
          <Route path="courses" element={<PageWrapper><CourseCatalog /></PageWrapper>} />
          <Route path="analytics" element={<PageWrapper><AnalyticsOverview /></PageWrapper>} />
          <Route path="ai" element={<PageWrapper><AIControl /></PageWrapper>} />
          <Route path="experience-lab" element={<PageWrapper><ExperienceShowcase /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><SecuritySettings /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Route>
        <Route
          path="/login"
          element={(
            <PageWrapper>
              <LearnerLogin />
            </PageWrapper>
          )}
        />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const ThemedApp = () => {
  const { settings } = useLayoutSettings();
  const theme = useMemo(() => getThemeByVariant(settings.themeVariant), [settings.themeVariant]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const App = () => (
  <LayoutSettingsProvider>
    <ThemedApp />
  </LayoutSettingsProvider>
);

export default App;
