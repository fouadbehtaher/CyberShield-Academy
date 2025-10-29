import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid,
  Slider,
  Switch,
  Typography,
} from '@mui/material';
import { Pause, PlayArrow, Settings, Stop } from '@mui/icons-material';

const SimulationControl = () => {
  const [simulationState, setSimulationState] = useState('stopped');
  const [difficulty, setDifficulty] = useState(5);
  const [aiAssistance, setAiAssistance] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    performance: 0,
    threatsDetected: 0,
    elapsedTime: '00:00',
  });

  const stateChipProps = useMemo(
    () => ({
      running: { color: 'success', label: 'قيد التشغيل' },
      paused: { color: 'warning', label: 'متوقف مؤقتاً' },
      stopped: { color: 'default', label: 'متوقف' },
    }),
    [],
  );

  useEffect(() => {
    let timerId;

    if (simulationState === 'running') {
      const startedAt = Date.now();
      timerId = window.setInterval(() => {
        const elapsedMs = Date.now() - startedAt;
        const minutes = Math.floor(elapsedMs / 60000)
          .toString()
          .padStart(2, '0');
        const seconds = Math.floor((elapsedMs % 60000) / 1000)
          .toString()
          .padStart(2, '0');

        setRealTimeMetrics((current) => ({
          performance: Math.min(100, Math.round((current.performance + Math.random() * 5) % 101)),
          threatsDetected: current.threatsDetected + Math.floor(Math.random() * 2),
          elapsedTime: `${minutes}:${seconds}`,
        }));
      }, 1500);
    }

    return () => {
      if (timerId) {
        window.clearInterval(timerId);
      }
    };
  }, [simulationState]);

  const handleStartSimulation = () => {
    setSimulationState('running');
    setRealTimeMetrics({ performance: 32, threatsDetected: 0, elapsedTime: '00:00' });
  };

  const handlePauseSimulation = () => {
    setSimulationState('paused');
  };

  const handleStopSimulation = () => {
    setSimulationState('stopped');
    setRealTimeMetrics({ performance: 0, threatsDetected: 0, elapsedTime: '00:00' });
  };

  const chipConfig = stateChipProps[simulationState] ?? stateChipProps.stopped;

  return (
    <div className="simulation-control" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} display="flex" flexDirection="column" gap={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                تحكم في المحاكاة
              </Typography>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrow />}
                  onClick={handleStartSimulation}
                  disabled={simulationState === 'running'}
                >
                  بدء
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Pause />}
                  onClick={handlePauseSimulation}
                  disabled={simulationState !== 'running'}
                >
                  إيقاف مؤقت
                </Button>
                <Button variant="outlined" color="error" startIcon={<Stop />} onClick={handleStopSimulation}>
                  إيقاف
                </Button>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Typography variant="subtitle2" gutterBottom>
                  حالة المحاكاة
                </Typography>
                <Chip label={chipConfig.label} color={chipConfig.color} size="medium" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <Settings fontSize="small" /> الإعدادات المتقدمة
              </Typography>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <Typography gutterBottom>مستوى الصعوبة: {difficulty}</Typography>
                  <Slider
                    value={difficulty}
                    onChange={(_, value) => setDifficulty(value)}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </div>
                <FormControlLabel
                  control={<Switch checked={aiAssistance} onChange={(event) => setAiAssistance(event.target.checked)} />}
                  label="المساعدة بالذكاء الاصطناعي"
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} display="flex" flexDirection="column" gap={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                المقاييس الحية
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>الأداء:</span>
                  <strong>{`${realTimeMetrics.performance}%`}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>التهديدات المكتشفة:</span>
                  <strong>{realTimeMetrics.threatsDetected}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>الوقت المنقضي:</span>
                  <strong>{realTimeMetrics.elapsedTime}</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                التنبيهات
              </Typography>
              <Alert severity="warning" sx={{ mb: 1 }}>
                ارتفاع غير طبيعي في حركة المرور
              </Alert>
              <Alert severity="error">اكتشاف محاولة اختراق</Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SimulationControl;
