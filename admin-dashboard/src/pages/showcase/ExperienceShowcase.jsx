import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  AutoAwesomeOutlined,
  InsightsOutlined,
  BoltOutlined,
  ShowChartOutlined,
  TimelineOutlined,
  TroubleshootOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLayoutSettings } from '../../hooks/useLayoutSettings.jsx';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const highlightVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const ExperienceShowcase = () => {
  const theme = useTheme();
  const surface = alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1);
  const { setThemeVariant, setUiEnhancements } = useLayoutSettings();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
      <Stack spacing={6}>
        <MotionPaper
          initial={highlightVariants.initial}
          animate={highlightVariants.animate}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            backgroundImage: theme.palette.gradients?.surface,
            boxShadow: theme.shadows?.[8] ?? '0 30px 60px -40px rgba(15, 23, 42, 0.45)',
          }}
        >
          <Stack spacing={3} alignItems="flex-start">
            <Chip
              icon={<AutoAwesomeOutlined fontSize="small" />}
              label="مختبر الواجهات المتقدمة"
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 999, px: 1.5 }}
            />
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h3">قوالب تصميم متطورة جاهزة للتفعيل</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
                اختر أي من الأنماط أدناه لوضع لوحة تحكم بديلة، مركز استجابة لحظي، أو تجربة تعلم
                غامرة. كل قالب يستجيب لإعدادات الثيم والحجم، ويعمل بتناغم مع وضع الواجهة المتقدم.
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<BoltOutlined />}
                onClick={() => setUiEnhancements('advanced')}
              >
                تفعيل القالب المختار
              </Button>
              <Button variant="outlined" size="large">تحميل كملف إعداد</Button>
            </Stack>
          </Stack>
        </MotionPaper>

        <Grid container spacing={3}>
          {[{
            title: 'لوحة القيادة التنبؤية',
            description: 'متابعة مباشرة لمؤشرات المخاطر مع تنبؤات مبنية على التعلم الآلي ودوائر ملاحظات سريعة.',
            metrics: [
              { label: 'مخاطر ناشئة', value: '12', trend: '+3.8% / ساعة' },
              { label: 'زمن الاستجابة', value: '4.2 دقيقة', trend: '-18% أسبوعي' },
            ],
            accent: theme.palette.primary.main,
            icon: <ShowChartOutlined />,
          }, {
            title: 'مركز الاستجابة الهجينة',
            description: 'سير عمل موحد للإخطارات، فرق الاستجابة، وخرائط الأثر مع حالات طوارئ محدّثة.',
            metrics: [
              { label: 'حالات حرجة', value: '3', trend: '2 قيد المراقبة' },
              { label: 'الإشعارات المفعّلة', value: '27', trend: '+5 خلال 10 دقائق' },
            ],
            accent: theme.palette.secondary.main,
            icon: <TroubleshootOutlined />,
          }, {
            title: 'بيئة التعلم الغامر',
            description: 'رحلة متدرجة للمتعلمين مع نقاط تفاعل، تحديات سياقية، وتقييمات حية بالذكاء الاصطناعي.',
            metrics: [
              { label: 'المتعلمون النشطون', value: '86', trend: '+12 اليوم' },
              { label: 'مستوى الإتقان المتوسط', value: '78%', trend: '+9 نقاط' },
            ],
            accent: theme.palette.info.main,
            icon: <InsightsOutlined />,
          }].map((card) => (
            <Grid key={card.title} item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.18, 1, 0.28, 1] }}
                whileHover={{ y: -8, boxShadow: '0 26px 60px -36px rgba(15, 23, 42, 0.45)' }}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  border: `1px solid ${alpha(card.accent, 0.28)}`,
                  background: alpha(card.accent, theme.palette.mode === 'dark' ? 0.08 : 0.06),
                  backdropFilter: 'blur(16px)',
                }}
              >
                <CardHeader
                  avatar={(
                    <Avatar sx={{ bgcolor: alpha(card.accent, 0.2), color: card.accent }}>
                      {card.icon}
                    </Avatar>
                  )}
                  title={<Typography variant="h5">{card.title}</Typography>}
                  subheader={card.description}
                  subheaderTypographyProps={{ sx: { color: 'text.secondary', lineHeight: 1.6 } }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    {card.metrics.map((metric) => (
                      <Paper
                        key={metric.label}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          borderColor: alpha(card.accent, 0.24),
                          backgroundColor: alpha(card.accent, 0.06),
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{metric.label}</Typography>
                            <Typography variant="h5">{metric.value}</Typography>
                          </Stack>
                          <Chip label={metric.trend} color="primary" variant="outlined" size="small" />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, parseFloat(metric.value) || 68)}
                          sx={{ mt: 2, borderRadius: 999, height: 6 }}
                        />
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <MotionPaper
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.18, 1, 0.28, 1] }}
              sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, position: 'relative', overflow: 'hidden' }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.4,
                  background: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.16), transparent 55%)',
                  pointerEvents: 'none',
                }}
              />
              <Stack spacing={1.5} sx={{ position: 'relative' }}>
                <Typography variant="h5">خط سير الاستجابة الذكية</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
                  تسلسل مُصمم للحوادث الحساسة: من اكتشاف anomaly وحتى الإغلاق الكامل مع توصيات آلية لكل مرحلة.
                </Typography>
              </Stack>
              <Divider sx={{ my: 3, borderColor: alpha(theme.palette.primary.main, 0.12) }} />
              <Stack spacing={3} sx={{ position: 'relative' }}>
                {[{
                  title: 'الكشف المبكر',
                  detail: 'خوارزميات التنبيه التنبؤية تطلق حدثاً متعدد المستلمين.',
                  owner: 'فريق مراقبة العمليات',
                }, {
                  title: 'تخصيص المسار',
                  detail: 'المنصة تُعين قائد الاستجابة وتقترح خطة مع عناصر جاهزة للتنفيذ.',
                  owner: 'ضابط المناوبة',
                }, {
                  title: 'الاحتواء والتحقق',
                  detail: 'تشغيل أوتوماتيكي للضوابط وتوثيق كافة الإجراءات في السجل الزمني.',
                  owner: 'فريق الأمن السيبراني',
                }].map((step, index) => (
                  <Stack key={step.title} direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: alpha(theme.palette.info.main, 0.2),
                        color: theme.palette.info.main,
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1">{step.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{step.detail}</Typography>
                      <Chip label={step.owner} size="small" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </MotionPaper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <MotionPaper
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.18, 1, 0.28, 1], delay: 0.08 }}
              sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}
            >
              <Stack spacing={2}>
                <Typography variant="h5">بلاطات جاهزة لإعادة استخدام الواجهة</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 460 }}>
                  دمج سريع لكتل تصميمية منسقة مسبقًا: دقائق لإنشاء لوحة جديدة بدون التنازل عن تجربة المستخدم.
                </Typography>
                <Grid container spacing={2.5}>
                  {[{
                    label: 'مخبر الرؤى اللحظية',
                    description: 'مخططات ذاتية التحديث مع حالات تنبيه بالألوان التكيفية.',
                  }, {
                    label: 'جداول عمليات ذكية',
                    description: 'فلترة سياقية وتجميد الأعمدة مع شرائح تلخيصية للمديرين.',
                  }, {
                    label: 'بطاقات تجربة التعلم',
                    description: 'مؤشرات تقدم مشتركة مع دعامات تحفيزية ونقاط خبرة.',
                  }, {
                    label: 'وحدة تفاعل الدردشة التنبؤية',
                    description: 'ردود وأتمتة مستندة إلى الدور الوظيفي وتاريخ الحالة.',
                  }].map((tile) => (
                    <Grid item xs={12} sm={6} key={tile.label}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          height: '100%',
                          borderColor: alpha(surface, 0.4),
                          background: alpha(surface, theme.palette.mode === 'dark' ? 0.4 : 0.18),
                        }}
                      >
                        <Stack spacing={1.25}>
                          <Typography variant="subtitle1">{tile.label}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{tile.description}</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </MotionPaper>
          </Grid>
        </Grid>

        <MotionPaper
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={1.5}>
              <Typography variant="h5">نسق الألوان متعدد الطبقات</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 520 }}>
                كل ثيم يزوّد مستويات منفصلة للخلفية، الإبرازات، والظلال الفعالة، مما يفتح المجال لتجارب مخصصة
                بدون تفكيك البنية الأساسية للمنتج.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              {['neo-aurora', 'cosmic-pulse', 'solar-flare', 'luminous-mist', 'midnight-forge'].map((variant) => (
                <Chip
                  key={variant}
                  label={variant}
                  variant="outlined"
                  color="primary"
                  onClick={() => setThemeVariant(variant)}
                />
              ))}
            </Stack>
          </Stack>
          <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.12) }} />
          <Grid container spacing={3}>
            {[{
              name: 'طبقة الخلفية',
              tokens: ['surface-100', 'surface-200', 'glass-frosted'],
            }, {
              name: 'طبقة التفاعل',
              tokens: ['cta-primary', 'cta-ghost', 'chips-emphasis'],
            }, {
              name: 'طبقة المعلومات',
              tokens: ['text-standard', 'text-muted', 'borders-active'],
            }, {
              name: 'طبقة الحركة',
              tokens: ['glow-primary', 'glow-secondary', 'motion-depth'],
            }].map((layer) => (
              <Grid item xs={12} sm={6} md={3} key={layer.name}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderColor: alpha(theme.palette.primary.main, 0.14),
                    background: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.08),
                  }}
                >
                  <Typography variant="subtitle1">{layer.name}</Typography>
                  <Stack spacing={1}>
                    {layer.tokens.map((token) => (
                      <Box
                        key={token}
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 2,
                          background: alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? 0.06 : 0.7),
                          color: theme.palette.text.primary,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {token}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </MotionPaper>
      </Stack>
    </Container>
  );
};

export default ExperienceShowcase;
