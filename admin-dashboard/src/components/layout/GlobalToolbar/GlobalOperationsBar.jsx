import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AutoAwesomeRounded, BlurOnRounded, SyncRounded } from '@mui/icons-material';
import { useLayoutSettings } from '../../../hooks/useLayoutSettings.jsx';

const connectors = [
  { id: 'users-service', label: 'خدمة المستخدمين', latency: 182, load: 46, status: 'متصل', tone: 'success' },
  { id: 'courses-service', label: 'مستودع المحتوى', latency: 236, load: 58, status: 'متزامن جزئياً', tone: 'info' },
  { id: 'sim-core', label: 'محرّك المحاكاة', latency: 141, load: 72, status: 'نشط', tone: 'secondary' },
];

const widthLabels = {
  boxed: 'إطار مركّز',
  wide: 'عرض واسع',
  fluid: 'عرض ممتد',
};

const densityLabels = {
  compact: 'كثافة عالية',
  balanced: 'كثافة متوازنة',
  relaxed: 'كثافة مريحة',
};

const scaleLabels = {
  compact: 'تحجيم مضغوط',
  standard: 'التحجيم القياسي',
  expanded: 'تحجيم موسّع',
  immersive: 'تحجيم غامر',
};

const GlobalOperationsBar = () => {
  const { settings, updateWidthMode, updateDensity, updateScale, toggleGlass } = useLayoutSettings();

  return (
    <Card
      sx={{
        borderRadius: 26,
        backgroundImage: 'linear-gradient(160deg, rgba(2, 6, 23, 0.92), rgba(14, 165, 233, 0.18))',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: { xs: 2.25, md: 3 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', lg: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <SyncRounded color="info" />
            <Typography variant="subtitle1" fontWeight={600}>
              مركز المزامنة الفوري
            </Typography>
            <Chip size="small" label="تحديث كل 60 ثانية" color="info" variant="outlined" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: '100%' }}>
            <ButtonGroup size="small" color="primary" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {(['boxed', 'wide', 'fluid']).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => updateWidthMode(mode)}
                  variant={settings.widthMode === mode ? 'contained' : 'outlined'}
                >
                  {widthLabels[mode]}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup size="small" color="secondary" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {(['compact', 'balanced', 'relaxed']).map((density) => (
                <Button
                  key={density}
                  onClick={() => updateDensity(density)}
                  variant={settings.density === density ? 'contained' : 'outlined'}
                >
                  {densityLabels[density]}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup size="small" color="info" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {(['standard', 'expanded', 'immersive']).map((scale) => (
                <Button
                  key={scale}
                  onClick={() => updateScale(scale)}
                  variant={settings.uiScale === scale ? 'contained' : 'outlined'}
                >
                  {scaleLabels[scale]}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
        </Stack>

        <Divider flexItem sx={{ borderColor: alpha('#38bdf8', 0.12) }} />

        <Grid container spacing={2}>
          {connectors.map((connector) => {
            const progressColor = connector.tone === 'secondary' ? 'secondary' : 'primary';
            const progressStyles = connector.tone === 'info'
              ? { '& .MuiLinearProgress-bar': { backgroundColor: '#38bdf8' } }
              : connector.tone === 'success'
                ? { '& .MuiLinearProgress-bar': { backgroundColor: '#22d3ee' } }
                : undefined;

            return (
              <Grid item xs={12} md={4} key={connector.id}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 20,
                    border: `1px solid ${alpha('#38bdf8', 0.12)}`,
                    backgroundColor: alpha('#0f172a', 0.64),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    height: '100%',
                  }}
                >
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">{connector.label}</Typography>
                    <Chip label={connector.status} size="small" color={connector.tone} variant="outlined" />
                  </Stack>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        وقت الاستجابة
                      </Typography>
                      <Typography variant="caption" color="text.primary">
                        {connector.latency} ms
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={connector.load} color={progressColor} sx={progressStyles} />
                    <Typography variant="caption" color="text.secondary">
                      حمل الخدمة {connector.load}%
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Divider flexItem sx={{ borderColor: alpha('#38bdf8', 0.12) }} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip icon={<AutoAwesomeRounded fontSize="small" />} label={widthLabels[settings.widthMode]} color="info" variant="outlined" />
            <Chip icon={<AutoAwesomeRounded fontSize="small" />} label={densityLabels[settings.density]} color="secondary" variant="outlined" />
            <Chip icon={<AutoAwesomeRounded fontSize="small" />} label={scaleLabels[settings.uiScale]} color="primary" variant="outlined" />
          </Stack>
          <Tooltip title={settings.glassOverlay ? 'إيقاف تأثير الزجاج الديناميكي' : 'تشغيل تأثير الزجاج الديناميكي'}>
            <Button startIcon={<BlurOnRounded />} size="small" variant={settings.glassOverlay ? 'contained' : 'outlined'} onClick={toggleGlass}>
              طبقة الزجاج الديناميكية
            </Button>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GlobalOperationsBar;
