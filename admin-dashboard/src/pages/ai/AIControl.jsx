import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { AutoAwesome, DownloadOutlined, Tune } from '@mui/icons-material';
import { DataTable, Modal, Notification, RealTimeChart } from '../../components';
import AnimatedCard from '../../components/advanced/AnimatedCard.jsx';

const aiMetrics = [
  { label: 'الدقة', value: '94.2%', trend: '↑ 2.1% أسبوعي' },
  { label: 'الاستدعاء', value: '89.7%', trend: '↑ 1.4% أسبوعي' },
  { label: 'النقاط F1', value: '91.8%', trend: '↑ 1.9% أسبوعي' },
];

const recommendationSample = [
  { id: 'rec-1', scenario: 'استجابة للحوادث', confidence: 0.87, audience: 'المستوى المتوسط', lastRun: 'قبل ساعتين' },
  { id: 'rec-2', scenario: 'هجمات التصيد', confidence: 0.79, audience: 'المستوى المبتدئ', lastRun: 'قبل 35 دقيقة' },
  { id: 'rec-3', scenario: 'سلسلة التوريد', confidence: 0.91, audience: 'المستوى المتقدم', lastRun: 'قبل 12 دقيقة' },
];

const modelVariants = [
  { value: 'transformer', label: 'Transformer' },
  { value: 'lstm', label: 'LSTM' },
  { value: 'cnn', label: 'CNN' },
  { value: 'random-forest', label: 'Random Forest' },
  { value: 'xgboost', label: 'XGBoost' },
];

const modelLoadSamples = [42, 48, 45, 52, 47, 50, 55, 53, 58, 54, 51, 49];

const AIControl = () => {
  const [aiModel, setAiModel] = useState(modelVariants[0].value);
  const [learningRate, setLearningRate] = useState(0.001);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);
  const [personalization, setPersonalization] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const recommendationColumns = useMemo(
    () => [
      { field: 'scenario', label: 'السيناريو', render: (row) => <Typography fontWeight={600}>{row.scenario}</Typography> },
      { field: 'audience', label: 'الجمهور المستهدف' },
      {
        field: 'confidence',
        label: 'درجة الثقة',
        render: (row) => (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Typography>{(row.confidence * 100).toFixed(0)}%</Typography>
            <Chip size="small" label={row.confidence > 0.85 ? 'مرتفع' : 'متوسط'} color={row.confidence > 0.85 ? 'success' : 'warning'} />
          </Stack>
        ),
        align: 'center',
      },
      { field: 'lastRun', label: 'آخر تشغيل', align: 'center' },
    ],
    [],
  );

  const handleModelRetrain = () => {
    console.info('Retraining model with parameters', {
      aiModel,
      learningRate,
      confidenceThreshold,
      personalization,
    });
    setNotification({ open: true, message: 'بدأت عملية إعادة التدريب.', severity: 'info' });
  };

  const handleDownloadLogs = () => {
    setNotification({ open: true, message: 'جارٍ تجهيز تقرير الأداء للتحميل.', severity: 'success' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <div>
          <Typography variant="h4">تحكم في الذكاء الاصطناعي</Typography>
          <Typography variant="body1" color="text.secondary">
            قم بضبط خوارزميات التوصية والتحليل التنبؤي، وراقب تأثير الإعدادات على جودة المخرجات.
          </Typography>
        </div>
        <Button variant="outlined" startIcon={<DownloadOutlined />} onClick={handleDownloadLogs}>
          تنزيل التقرير التنفيذي
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnimatedCard animation="rise">
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <Tune fontSize="small" /> إعدادات النموذج
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id="ai-model-label">نموذج الذكاء الاصطناعي</InputLabel>
                <Select
                  labelId="ai-model-label"
                  value={aiModel}
                  label="نموذج الذكاء الاصطناعي"
                  onChange={(event) => setAiModel(event.target.value)}
                >
                  {modelVariants.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      {model.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography gutterBottom sx={{ mt: 3 }}>
                معدل التعلم: {learningRate.toFixed(4)}
              </Typography>
              <Slider
                value={learningRate}
                onChange={(_, value) => setLearningRate(value)}
                min={0.0001}
                max={0.01}
                step={0.0001}
                valueLabelDisplay="auto"
              />

              <Typography gutterBottom sx={{ mt: 3 }}>
                حد الثقة: {(confidenceThreshold * 100).toFixed(0)}%
              </Typography>
              <Slider
                value={confidenceThreshold}
                onChange={(_, value) => setConfidenceThreshold(value)}
                min={0.5}
                max={0.95}
                step={0.05}
                valueLabelDisplay="auto"
              />

              <FormControlLabel
                sx={{ mt: 3 }}
                control={<Switch checked={personalization} onChange={(event) => setPersonalization(event.target.checked)} />}
                label="التخصيص الديناميكي"
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={() => setModalOpen(true)}>
                  تهيئة حملة تكيفية
                </Button>
                <Button variant="contained" color="primary" onClick={handleModelRetrain} fullWidth>
                  إعادة تدريب النموذج
                </Button>
              </Stack>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard delay={0.06}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <AutoAwesome fontSize="small" /> أداء النموذج
              </Typography>

              <Grid container spacing={2}>
                {aiMetrics.map((metric, index) => (
                  <Grid item xs={12} sm={4} key={metric.label}>
                    <AnimatedCard variant="outlined" animation="zoom" delay={0.08 + index * 0.04}>
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {metric.label}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {metric.value}
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          {metric.trend}
                        </Typography>
                      </CardContent>
                    </AnimatedCard>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  الحمل اللحظي لمحرك الاستدلال
                </Typography>
                <RealTimeChart data={modelLoadSamples} height={160} color="#0288d1" />
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>

      <AnimatedCard>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">توصيات المحرك الحالية</Typography>
          <DataTable columns={recommendationColumns} rows={recommendationSample} rowKey="id" dense emptyMessage="لا توجد توصيات متاحة حالياً." />
        </CardContent>
      </AnimatedCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="إطلاق حملة تكيفية جديدة">
        <Typography variant="body2" color="text.secondary">
          استخدم النموذج لتحديد سيناريو التدريب التكيفي، وتعيين مستوى المخاطرة، وضبط الأهداف الرئيسية قبل الإطلاق.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            سيتم توفير نموذج تفصيلي لاحقاً لربطه بمحرك السيناريوهات.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button onClick={() => setModalOpen(false)} variant="text">
            إغلاق
          </Button>
          <Button onClick={() => setModalOpen(false)} variant="contained">
            حفظ كمسودة
          </Button>
        </Stack>
      </Modal>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      />
    </Box>
  );
};

export default AIControl;
