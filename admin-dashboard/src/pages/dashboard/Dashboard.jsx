import React from 'react';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FlashOnRounded,
  RefreshRounded,
  RocketLaunchRounded,
  ShieldMoonRounded,
  TimelineRounded,
} from '@mui/icons-material';
import { LineChart, BarChart, UserActivity, SystemHealth, RealTimeChart } from '../../components';
import AnimatedCard from '../../components/advanced/AnimatedCard.jsx';

const userActivityData = [
  { label: 'الإثنين', value: 120 },
  { label: 'الثلاثاء', value: 150 },
  { label: 'الأربعاء', value: 180 },
  { label: 'الخميس', value: 210 },
  { label: 'الجمعة', value: 240 },
  { label: 'السبت', value: 190 },
  { label: 'الأحد', value: 160 },
];

const skillsDistributionData = [
  { label: 'الهندسة الاجتماعية', value: 35 },
  { label: 'التحليل الجنائي', value: 28 },
  { label: 'حماية الشبكات', value: 42 },
  { label: 'التعلم الآلي الأمني', value: 30 },
];

const recentUserSignals = [
  { user: 'عائشة', action: 'أكملت دورة التهديدات المتقدمة', timestamp: 'قبل 12 دقيقة', severity: 'high', tags: ['تدريب متقدم'] },
  { user: 'عمر', action: 'حقق 92% في محاكاة الاستجابة للحوادث', timestamp: 'قبل 32 دقيقة', severity: 'medium', tags: ['محاكاة'] },
  { user: 'ليلى', action: 'انضمت إلى مسار التحليل الجنائي', timestamp: 'قبل ساعة', severity: 'low', tags: ['مسار جديد'] },
];

const systemHealthMetrics = [
  { name: 'صحة البنية التحتية', status: 'excellent', description: 'الخوادم تعمل ضمن 65% من القدرة القصوى.', progress: 92 },
  { name: 'امتثال المتدربين', status: 'good', description: '82% من المتدربين التزموا بمواعيد المهام الأسبوعية.', progress: 82 },
  { name: 'تنبيهات SOC', status: 'caution', description: '3 تنبيهات بحاجة مراجعة قبل نهاية اليوم.', progress: 58 },
  { name: 'مؤشر التهديدات', status: 'critical', description: 'زيادة بنسبة 21% في محاولات الهجوم على الشبكات.', progress: 37 },
];

const modelLoadSamples = [62, 66, 58, 72, 64, 75, 68, 73, 65, 70, 78, 74, 69, 71];

const timeframes = [
  { value: '7d', label: 'آخر 7 أيام' },
  { value: '30d', label: 'آخر 30 يوماً' },
  { value: '90d', label: 'آخر 90 يوماً' },
];

const executiveSignals = [
  { title: 'موثوقية الاستجابة', value: '97%', tone: 'success', description: 'استقرار مراكز العمليات اللامركزية.' },
  { title: 'معدل الكشف المبكر', value: '12.4%', tone: 'info', description: 'ارتفاع في اكتشاف الحالات الشاذة قبل الوصول للإنتاج.' },
  { title: 'سعادة المتدربين', value: '92%', tone: 'secondary', description: 'تصاعد التفاعل مع تحديات اليوم الحي.' },
];

const initiativeBacklog = [
  { id: 'mission-1', title: 'ترقية مختبر الدفاعات التكيفية', leader: 'فريق الحماية السحابية', eta: 'اليوم 14:30', status: 'جارٍ المزامنة' },
  { id: 'mission-2', title: 'اختبار حملة تصيد لدفعة مارس', leader: 'فريق التوعية', eta: 'اليوم 16:10', status: 'جاهز للتنفيذ' },
  { id: 'mission-3', title: 'تحديث سياسات Zero Trust', leader: 'معمل البنية التحتية', eta: 'غداً 09:45', status: 'بمرحلة الاعتماد' },
];

const syncMilestones = [
  { id: 'sync-1', label: 'تدفقات SOC', progress: 88, tone: 'info' },
  { id: 'sync-2', label: 'تكامل المنصات التدريبية', progress: 74, tone: 'secondary' },
  { id: 'sync-3', label: 'لوحة القيادة التنفيذية', progress: 96, tone: 'success' },
];

const knowledgeHighlights = [
  { id: 'highlight-1', title: 'تحليل سلوك الهجمات', detail: 'كشف 18 نمطاً غير اعتيادي الليلة الماضية.', status: 'متسارع' },
  { id: 'highlight-2', title: 'جاهزية الاستجابة للحوادث', detail: 'متوسط زمن الإغلاق 12 دقيقة مقابل الهدف 15 دقيقة.', status: 'ممتاز' },
  { id: 'highlight-3', title: 'التجارب التدريبية الحية', detail: '4 مختبرات تعمل الآن مع 63 مشاركاً.', status: 'نشط' },
];

const Dashboard = () => {
  const [timeframe, setTimeframe] = React.useState(timeframes[0].value);
  const [modelLoad, setModelLoad] = React.useState(modelLoadSamples);
  const [autoSync, setAutoSync] = React.useState(true);

  React.useEffect(() => {
    if (!autoSync) {
      return () => {};
    }
    const timer = window.setInterval(() => {
      setModelLoad((prev) => {
        const nextValue = Math.max(34, Math.min(96, prev[prev.length - 1] + (Math.random() * 14 - 7)));
        return [...prev.slice(1), Math.round(nextValue)];
      });
    }, 3600);

    return () => window.clearInterval(timer);
  }, [autoSync]);

  const handleRefresh = () => {
    console.info('Refreshing dashboard insights for timeframe', timeframe);
    setModelLoad((prev) => prev.map((value, index) => (index === prev.length - 1 ? Math.min(100, value + 6) : value)));
  };

  return (
    <div className="dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AnimatedCard animation="rise">
            <CardContent>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip color="primary" icon={<RocketLaunchRounded />} label="وضع القيادة" sx={{ fontWeight: 700 }} />
                      <Chip color="secondary" variant="outlined" label={timeframes.find((item) => item.value === timeframe)?.label}
                        sx={{ borderWidth: 1.5 }}
                      />
                    </Stack>
                    <Typography variant="h3">لوحة التحكم الشاملة</Typography>
                    <Typography variant="body1" color="text.secondary">
                      إشراف لحظي على الأنظمة التدريبية، تدفق المحاكاة، وأداء المتعلمين مع مركز قيادة متزامن بالكامل.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="dashboard-timeframe">الإطار الزمني</InputLabel>
                        <Select
                          labelId="dashboard-timeframe"
                          value={timeframe}
                          label="الإطار الزمني"
                          onChange={(event) => setTimeframe(event.target.value)}
                        >
                          {timeframes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <ButtonGroup variant="outlined" color="primary" size="small">
                        <Button onClick={() => setAutoSync(true)} variant={autoSync ? 'contained' : 'outlined'} startIcon={<ShieldMoonRounded fontSize="small" />}>
                          مزامنة آلية
                        </Button>
                        <Button onClick={() => setAutoSync(false)} variant={!autoSync ? 'contained' : 'outlined'} startIcon={<FlashOnRounded fontSize="small" />}>
                          يدوي
                        </Button>
                      </ButtonGroup>
                      <Button variant="contained" startIcon={<RefreshRounded />} onClick={handleRefresh}>
                        تحديث الآن
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={2}>
                    {executiveSignals.map((signal, index) => (
                      <Grid item xs={12} sm={6} md={12} key={signal.title}>
                        <AnimatedCard variant="outlined" animation="zoom" delay={0.08 + index * 0.04} sx={{ height: '100%' }}>
                          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {signal.title}
                            </Typography>
                            <Typography variant="h4">{signal.value}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {signal.description}
                            </Typography>
                          </CardContent>
                        </AnimatedCard>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {[{ title: 'إجمالي المستخدمين', value: '1,234', progress: 87, delta: '+38 خلال 24 ساعة' },
          { title: 'الدورات النشطة', value: '56', progress: 68, delta: '+3 مسارات جديدة' },
          { title: 'جلسات المحاكاة', value: '89', progress: 94, delta: '5 جلسات مباشرة الآن' },
          { title: 'متوسط الأداء', value: '87%', progress: 87, delta: '+4% مقارنة بالأسبوع الماضي' }].map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <AnimatedCard delay={0.05}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {metric.title}
                </Typography>
                <Typography variant="h4">{metric.value}</Typography>
                <Typography variant="caption" color="success.main">
                  {metric.delta}
                </Typography>
                <LinearProgress value={metric.progress} variant="determinate" color="primary" />
              </CardContent>
            </AnimatedCard>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                نشاط المستخدمين
              </Typography>
              <LineChart data={userActivityData} />
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <AnimatedCard delay={0.07}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                توزيع المهارات
              </Typography>
              <BarChart data={skillsDistributionData} />
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                إشارات المستخدمين الأخيرة
              </Typography>
              <UserActivity data={recentUserSignals} />
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard delay={0.05}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الحمل اللحظي لمحرك التوصيات
              </Typography>
              <RealTimeChart data={modelLoad} height={180} />
              <Divider sx={{ my: 2 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {syncMilestones.map((item) => (
                  <Box key={item.id} sx={{ flex: 1, p: 2, borderRadius: 3, backgroundColor: alpha('#38bdf8', 0.08) }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {item.label}
                    </Typography>
                    <LinearProgress variant="determinate" value={item.progress} color={item.tone} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      تقدم {item.progress}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <AnimatedCard>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimelineRounded fontSize="small" color="primary" />
                <Typography variant="h6">طابور المهمات القيادية</Typography>
              </Stack>
              <List>
                {initiativeBacklog.map((mission, index) => (
                  <React.Fragment key={mission.id}>
                    <ListItem alignItems="flex-start" sx={{ borderRadius: 3 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#38bdf8', 0.2), color: '#38bdf8' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={600}>
                              {mission.title}
                            </Typography>
                            <Chip size="small" color="info" label={mission.status} />
                          </Stack>
                        }
                        secondary={
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={1}>
                            <Typography variant="body2" color="text.secondary">
                              {mission.leader}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {mission.eta}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                    {index < initiativeBacklog.length - 1 && <Divider component="li" variant="inset" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <AnimatedCard delay={0.07}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ShieldMoonRounded fontSize="small" color="secondary" />
                <Typography variant="h6">نبض المعرفة اللحظي</Typography>
              </Stack>
              <Stack spacing={2}>
                {knowledgeHighlights.map((highlight) => (
                  <Box key={highlight.id} sx={{ p: 2, borderRadius: 3, backgroundColor: alpha('#1f2937', 0.6) }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600}>
                        {highlight.title}
                      </Typography>
                      <Chip size="small" color="secondary" variant="outlined" label={highlight.status} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {highlight.detail}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                نبض المنصة المتكاملة
              </Typography>
              <Typography variant="body2" color="text.secondary">
                مراقبة فورية لحالة الأنظمة، الاتصالات، وسياسات الأمن في جميع الأقاليم التشغيلية.
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12}>
          <SystemHealth metrics={systemHealthMetrics} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
