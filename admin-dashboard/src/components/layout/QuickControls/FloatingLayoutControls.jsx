import React, { useState } from 'react';
import {
  Box,
  Divider,
  Fab,
  FormControlLabel,
  Menu,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { TuneRounded } from '@mui/icons-material';
import { useLayoutSettings } from '../../../hooks/useLayoutSettings.jsx';
import { AVAILABLE_THEME_VARIANTS } from '../../../styles/themes';

const FloatingLayoutControls = () => {
  const {
    settings,
    updateScale,
    setSidebarVisible,
    setHeaderVisible,
    setUiEnhancements,
    setThemeVariant,
  } = useLayoutSettings();
  const [anchorEl, setAnchorEl] = useState(null);
  const themeOptions = AVAILABLE_THEME_VARIANTS;


  const scaleOptions = [
    { value: 'standard', label: 'قياسي' },
    { value: 'expanded', label: 'موسّع' },
    { value: 'immersive', label: 'غامر' },
  ];

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 16, md: 24 },
        left: { xs: 16, md: 24 },
        zIndex: (theme) => theme.zIndex.tooltip + 1,
      }}
    >
      <Tooltip title="تحكم التخطيط">
        <Fab color="primary" size="medium" onClick={handleOpen} aria-label="إعدادات الواجهة السريعة">
          <TuneRounded />
        </Fab>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { px: 2.5, py: 2, minWidth: 280 } }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle1">تحسينات الواجهة</Typography>
          <ToggleButtonGroup
            exclusive
            value={settings.uiEnhancements}
            onChange={(_, value) => value && setUiEnhancements(value)}
            size="small"
            color="primary"
            sx={{ '& .MuiToggleButton-root': { flex: 1, borderRadius: 2 } }}
          >
            <ToggleButton value="standard">قياسي</ToggleButton>
            <ToggleButton value="advanced">متقدم</ToggleButton>
          </ToggleButtonGroup>
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
          <Typography variant="subtitle1">سمة الألوان</Typography>
          <ToggleButtonGroup
            exclusive
            value={settings.themeVariant}
            onChange={(_, value) => value && setThemeVariant(value)}
            size="small"
            color="secondary"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 1,
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
              },
            }}
          >
            {themeOptions.map((option) => (
              <ToggleButton key={option.id} value={option.id}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
          <Typography variant="subtitle1">تحجيم الواجهة</Typography>
          <ToggleButtonGroup
            exclusive
            value={settings.uiScale}
            onChange={(_, value) => value && updateScale(value)}
            size="small"
            color="info"
            sx={{
              '& .MuiToggleButton-root': {
                flex: 1,
                borderRadius: 2,
              },
            }}
          >
            {scaleOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
          <Typography variant="subtitle1">عرض اللوحات</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.sidebarVisible}
                onChange={(event) => setSidebarVisible(event.target.checked)}
              />
            }
            label={settings.sidebarVisible ? 'إخفاء اللوحة الجانبية' : 'إظهار اللوحة الجانبية'}
          />
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
          <FormControlLabel
            control={
              <Switch
                checked={settings.headerVisible}
                onChange={(event) => setHeaderVisible(event.target.checked)}
              />
            }
            label={settings.headerVisible ? 'إخفاء اللوحة الرئيسية' : 'إظهار اللوحة الرئيسية'}
          />
        </Stack>
      </Menu>
    </Box>
  );
};

export default FloatingLayoutControls;
