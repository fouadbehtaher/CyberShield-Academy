import React, { useEffect, useMemo, useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import { useLayoutSettings } from '../../../hooks/useLayoutSettings.jsx';
import FloatingLayoutControls from '../QuickControls/FloatingLayoutControls';
import AdvancedAtmosphere from '../Advanced/AdvancedAtmosphere';

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings, derived } = useLayoutSettings();

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!settings.sidebarVisible) {
      setMobileOpen(false);
    }
  }, [settings.sidebarVisible]);

  const mainPadding = useMemo(() => ({
    px: derived.padding.x,
    py: derived.padding.y,
  }), [derived.padding.x, derived.padding.y]);

  const maxWidth = useMemo(() => (typeof derived.maxWidth === 'number' ? `${derived.maxWidth}px` : derived.maxWidth), [derived.maxWidth]);

  return (
    <Box
      sx={{
        display: 'flex',
        direction: 'rtl',
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {settings.uiEnhancements === 'advanced' ? (
        <AdvancedAtmosphere />
      ) : (
        settings.glassOverlay && (
          <Box
            aria-hidden
            sx={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.22), transparent 45%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.2), transparent 50%), radial-gradient(circle at 50% 75%, rgba(14, 165, 233, 0.18), transparent 55%)',
              opacity: 0.75,
              zIndex: 0,
            }}
          />
        )
      )}
      {settings.headerVisible && <Header onToggleSidebar={handleToggleSidebar} />}
      <Sidebar mobileOpen={mobileOpen} onClose={handleToggleSidebar} visible={settings.sidebarVisible} />
      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
          flexGrow: 1,
          px: mainPadding.px,
          py: mainPadding.py,
          width: settings.sidebarVisible ? { md: 'calc(100% - 280px)' } : { md: '100%' },
          maxWidth,
          marginInline: 'auto',
        }}
      >
        {settings.headerVisible && <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, minHeight: 'calc(100vh - 120px)' }}>
          <Outlet />
          <Footer />
        </Box>
      </Box>
      <FloatingLayoutControls />
    </Box>
  );
};

export default AppLayout;
