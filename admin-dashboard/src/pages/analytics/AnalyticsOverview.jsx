import React from 'react';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DownloadOutlined, InsightsOutlined, WarningAmber } from '@mui/icons-material';
import { LineChart, BarChart, RealTimeChart } from '../../components';
import AnimatedCard from '../../components/advanced/AnimatedCard.jsx';

const engagementData = [
  { label: 'يناير', value: 68 },
  { label: 'فبراير', value: 72 },
  { label: 'مارس', value: 75 },
  { label: 'أبريل', value: 81 },
  { label: 'مايو', value: 84 },
  { label: 'يونيو', value: 88 },
];

const riskData = [
  { label: 'هجمات تصيد', value: 14 },
  { label: 'اختراق حساب', value: 9 },
  { label: 'تسرب بيانات', value: 4 },
  { label: 'سلوك داخلي ضار', value: 3 },
];

const alerts = [
  { type: 'Critical', message: 'ارتفاع محاولات التصيد الموجه في الأسبوع الحالي.' },
  { type: 'Warning', message: '3 متعلمين لم ينهوا تقييم الامتثال الأخير.' },
];

const timeframes = [
  { value: 'lastWeek', label: 'الأسبوع' },
  { value: 'lastMonth', label: 'الشهر' },
  { value: 'quarter', label: 'الربع' },
];

const anomalySamples = [22, 28, 26, 35, 38, 33, 41, 37, 43, 39];

const personaSegments = [
  { value: 'cohort-pro', label: 'دفعة المدافعين المحترفين', adoption: 92, intensity: 'مرتفع', focus: 'يحتاجون تحديات محاكاة إضافية خلال 24 ساعة.' },
  { value: 'l1-analysts', label: 'محللو L1 الجدد', adoption: 76, intensity: 'متوسط', focus: 'ارتفع معدل الاستجابة المبكرة بنسبة 9٪ هذا الأسبوع.' },
  { value: 'executive', label: 'القيادة التنفيذية', adoption: 64, intensity: 'منخفض', focus: 'يفضلون تقارير مختصرة مع مؤشرات المخاطر الحرجة.' },
];

const experientialBursts = [
  { id: 'burst-1', label: 'تحليل هجمات سلسلة التوريد', delta: '+14%', detail: 'تكرار الامتحانات العملية انعكس بتحسن ملحوظ.' },
  { id: 'burst-2', label: 'مختبرات الاستجابة للحوادث', delta: '+9%', detail: 'الدفعات الموزعة سجلت أسرع زمن احتواء.' },
  { id: 'burst-3', label: 'ورش الهندسة الاجتماعية', delta: '+5%', detail: 'انخراط متزايد مع وحدات الواقع الممتد.' },
];

const AnalyticsOverview = () => {
  const [timeframe, setTimeframe] = React.useState(timeframes[0].value);
  const [segment, setSegment] = React.useState(personaSegments[0].value);

  const handleDownload = () => {
    console.info('Exporting analytics report for range', timeframe);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <AnimatedCard animation="rise">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Typography variant="h4">تحليلات التعلّم</Typography>
                <Typography variant="body1" color="text.secondary">
                  قراءة ذكية للانخراط، المخاطر، ومسارات التطور. كل الإشارات متزامنة مع مراكز العمليات.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <ToggleButtonGroup
                    exclusive
                    value={timeframe}
                    onChange={(_, newValue) => newValue && setTimeframe(newValue)}
                    size="small"
                    color="primary"
                  >
                    {timeframes.map((option) => (
                      <ToggleButton key={option.value} value={option.value}>
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <Button variant="contained" startIcon={<DownloadOutlined />} onClick={handleDownload}>
                    تنزيل تقرير
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1.5}>
                {experientialBursts.map((burst) => (
                  <Box key={burst.id} sx={{ p: 2.5, borderRadius: 3, backgroundColor: alpha('#38bdf8', 0.08) }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">{burst.label}</Typography>
                      <Chip label={burst.delta} size="small" color="success" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {burst.detail}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </AnimatedCard>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <AnimatedCard>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                <InsightsOutlined color="primary" />
                <Typography variant="h6">معدل التفاعل مع المسارات التكيفية</Typography>
              </Stack>
              <LineChart data={engagementData} />
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <AnimatedCard delay={0.08}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <WarningAmber color="warning" />
                <Typography variant="h6">سجل المخاطر المكتشفة</Typography>
              </Stack>
              <BarChart data={riskData} layout="horizontal" height={240} />
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>مؤشر الشذوذ اللحظي</Typography>
              <RealTimeChart data={anomalySamples} height={160} color="#ef6c00" />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                * يتم تحديث المؤشر كل 5 دقائق بناءً على تدفقات البيانات الواردة من نظام SOC.
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <AnimatedCard delay={0.05}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Typography variant="h6">شرائح التعلّم المتقدمة</Typography>
                <ToggleButtonGroup
                  exclusive
                  value={segment}
                  onChange={(_, value) => value && setSegment(value)}
                  size="small"
                >
                  {personaSegments.map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
              <Stack spacing={2}>
                {personaSegments.map((option) => (
                  option.value === segment && (
                    <Box key={option.value} sx={{ p: 2.5, borderRadius: 3, backgroundColor: alpha('#0ea5e9', 0.08) }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                          {option.label}
                        </Typography>
                        <Chip label={`قوة التبني ${option.adoption}%`} color="primary" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                        {option.focus}
                      </Typography>
                      <LinearProgress variant="determinate" value={option.adoption} sx={{ mt: 2 }} />
                    </Box>
                  )
                ))}
              </Stack>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>تنبيهات تحتاج المتابعة</Typography>
              <Stack spacing={2}>
                {alerts.map((alert) => (
                  <Chip
                    key={alert.message}
                    label={alert.message}
                    color={alert.type === 'Critical' ? 'error' : 'warning'}
                    variant="outlined"
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Stack>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard delay={0.06}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">المؤشرات الأفضل أداءً</Typography>
              <Divider variant="middle" sx={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
              <List>
                {experientialBursts.map((burst, index) => (
                  <React.Fragment key={`${burst.id}-list`}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#22d3ee', 0.2), color: '#22d3ee' }}>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight={600}>{burst.label}</Typography>
                            <Chip size="small" label={burst.delta} color="success" />
                          </Stack>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {burst.detail}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < experientialBursts.length - 1 && <Divider component="li" variant="inset" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsOverview;
