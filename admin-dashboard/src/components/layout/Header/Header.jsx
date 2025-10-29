import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  OutlinedInput,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  RefreshRounded,
  SearchRounded,
  StormRounded,
  TuneRounded,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { findCurrentRoute } from '../../../routes/navigation';
import { useLayoutSettings } from '../../../hooks/useLayoutSettings.jsx';
import { NotificationSystem } from '../../../components';
import { AVAILABLE_THEME_VARIANTS } from '../../../styles/themes';

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const activeRoute = findCurrentRoute(location.pathname);
  const theme = useTheme();
  const now = new Date();
  const {
    settings,
    updateWidthMode,
    updateDensity,
    updateScale,
    toggleGlass,
    setSidebarVisible,
    setHeaderVisible,
    setUiEnhancements,
    setThemeVariant,
  } = useLayoutSettings();
  const [layoutAnchor, setLayoutAnchor] = React.useState(null);

  const widthOptions = [
    { value: 'boxed', label: 'إطار مركّز' },
    { value: 'wide', label: 'عرض واسع' },
    { value: 'fluid', label: 'عرض ممتد' },
  ];

  const densityOptions = [
    { value: 'compact', label: 'كثافة عالية' },
    { value: 'balanced', label: 'كثافة متوازنة' },
    { value: 'relaxed', label: 'كثافة مريحة' },
  ];

  const scaleOptions = [
    { value: 'standard', label: 'التحجيم القياسي' },
    { value: 'expanded', label: 'تحجيم موسّع' },
    { value: 'immersive', label: 'تحجيم غامر' },
  ];

  const themeOptions = AVAILABLE_THEME_VARIANTS;

  const layoutMenuOpen = Boolean(layoutAnchor);

  const handleOpenLayoutMenu = (event) => {
    setLayoutAnchor(event.currentTarget);
  };

  const handleCloseLayoutMenu = () => {
    setLayoutAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        direction: 'rtl',
        backgroundImage: (t) => t.palette.gradients?.surface,
        color: (t) => t.palette.text.primary,
        borderBottom: (t) => `1px solid ${alpha(t.palette.primary.main, 0.12)}`,
        boxShadow: '0 20px 45px -38px rgba(15, 23, 42, 0.9)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(24px)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleSidebar}
            sx={{
              display: { md: 'none' },
            }}
            aria-label="toggle sidebar"
          >
            <MenuIcon />
          </IconButton>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" component="h1">
                {activeRoute?.label ?? 'CyberShield Academy'}
              </Typography>
              <Chip
                size="small"
                color="success"
                label="متزامن"
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.light,
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {activeRoute?.description ?? 'إدارة التجربة التدريبية المتكاملة عبر الأكاديمية.'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {now.toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <OutlinedInput
            size="small"
            placeholder="بحث فوري عبر كل الوحدات..."
            sx={{
              display: { xs: 'none', lg: 'flex' },
              minWidth: 280,
              backgroundColor: alpha(theme.palette.common.white, 0.04),
              borderRadius: 999,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.14),
              },
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            }
          />
          <Tooltip title="ضبط الواجهة">
            <IconButton color="inherit" aria-label="layout settings" onClick={handleOpenLayoutMenu}>
              <TuneRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="تحديث البيانات المتزامنة">
            <IconButton color="inherit" aria-label="refresh" onClick={() => console.info('Sync trigger fired')}>
              <RefreshRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="لوحة الذكاء الاصطناعي" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <IconButton color="inherit" aria-label="ai hub">
              <StormRounded />
            </IconButton>
          </Tooltip>
          <Divider flexItem orientation="vertical" sx={{ borderColor: alpha(theme.palette.primary.main, 0.18) }} />
          <NotificationSystem />
          <Avatar
            src=""
            alt="قائد الأكاديمية"
            sx={{ width: 40, height: 40, bgcolor: alpha(theme.palette.primary.main, 0.3), border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}
          >
            CS
          </Avatar>
        </Stack>
      </Toolbar>
      <Menu
        anchorEl={layoutAnchor}
        open={layoutMenuOpen}
        onClose={handleCloseLayoutMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 360, borderRadius: 4, border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}` } }}
      >
        <Box sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              عرض اللوحة
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={settings.widthMode}
              onChange={(_, value) => value && updateWidthMode(value)}
              size="small"
              color="primary"
              sx={{ flexWrap: 'wrap', gap: 1, '& .MuiToggleButton-root': { flex: '1 0 30%' } }}
            >
              {widthOptions.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={{ borderRadius: 2 }}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              كثافة التباعد
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={settings.density}
              onChange={(_, value) => value && updateDensity(value)}
              size="small"
              color="secondary"
              sx={{ flexWrap: 'wrap', gap: 1, '& .MuiToggleButton-root': { flex: '1 0 30%' } }}
            >
              {densityOptions.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={{ borderRadius: 2 }}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              تحجيم الواجهة
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={settings.uiScale}
              onChange={(_, value) => value && updateScale(value)}
              size="small"
              color="info"
              sx={{ flexWrap: 'wrap', gap: 1, '& .MuiToggleButton-root': { flex: '1 0 45%' } }}
            >
              {scaleOptions.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={{ borderRadius: 2 }}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <FormControlLabel
            control={<Switch checked={settings.glassOverlay} onChange={toggleGlass} />}
            label="تأثير الزجاج الديناميكي"
          />
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              أنماط الألوان
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={settings.themeVariant}
              onChange={(_, value) => value && setThemeVariant(value)}
              size="small"
              color="secondary"
              sx={{ flexWrap: 'wrap', gap: 1, '& .MuiToggleButton-root': { flex: '1 0 45%' } }}
            >
              {themeOptions.map((option) => (
                <ToggleButton key={option.id} value={option.id} sx={{ borderRadius: 2 }}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            وضع الواجهة
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={settings.uiEnhancements}
            onChange={(_, value) => value && setUiEnhancements(value)}
            size="small"
            color="primary"
            sx={{ flexWrap: 'wrap', gap: 1, '& .MuiToggleButton-root': { flex: '1 0 45%' } }}
          >
            <ToggleButton value="standard" sx={{ borderRadius: 2 }}>
              قياسي
            </ToggleButton>
            <ToggleButton value="advanced" sx={{ borderRadius: 2 }}>
              متقدم
            </ToggleButton>
          </ToggleButtonGroup>
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
          <FormControlLabel
            control={
              <Switch
                checked={settings.sidebarVisible}
                onChange={(event) => setSidebarVisible(event.target.checked)}
              />
            }
            label={settings.sidebarVisible ? 'إخفاء اللوحة الجانبية' : 'إظهار اللوحة الجانبية'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.headerVisible}
                onChange={(event) => setHeaderVisible(event.target.checked)}
              />
            }
            label={settings.headerVisible ? 'إخفاء اللوحة الرئيسية' : 'إظهار اللوحة الرئيسية'}
          />
        </Box>
      </Menu>
    </AppBar>
  );
};

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Header;
