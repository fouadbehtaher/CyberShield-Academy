import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  BoltRounded,
  CheckCircleRounded,
  InsightsRounded,
  KeyboardArrowLeftRounded,
  NotificationsActiveRounded,
  SecurityRounded,
  VisibilityOffRounded,
  VisibilityRounded,
  WorkspacePremiumRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const featurePillars = [
  {
    title: 'تمرينات هجومية متزامنة',
    description: 'يتلقى المتعلم تمارين تحاكي سيناريوهات الهجوم مع تعليمات فورية.',
    icon: BoltRounded,
  },
  {
    title: 'مختبرات تفاعلية حية',
    description: 'بيئات افتراضية للتجربة، التحليل، والتعلم الجماعي.',
    icon: WorkspacePremiumRounded,
  },
  {
    title: 'مركز التنبيهات اللحظية',
    description: 'إشعارات فورية عن التحديات، التقارير، وأداء الفريق.',
    icon: NotificationsActiveRounded,
  },
  {
    title: 'تقارير معرفة معمقة',
    description: 'لوحات تتبع التقدم والجاهزية الدفاعية لكل مسار.',
    icon: InsightsRounded,
  },
];

const SAMPLE_CREDENTIALS = {
  email: 'test@soc.local',
  password: 'Admin123456',
};

const LearnerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(SAMPLE_CREDENTIALS.email);
  const [password, setPassword] = useState(SAMPLE_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const emailMatchesDemo = email.trim().toLowerCase() === SAMPLE_CREDENTIALS.email;

  const heroGlow = useMemo(() => ({
    background:
      'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.22), transparent 45%),' +
      'radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.18), transparent 55%),' +
      'radial-gradient(circle at 30% 80%, rgba(14, 165, 233, 0.2), transparent 50%)',
  }), []);

  const persistDemoSession = (normalizedEmail) => {
    if (rememberMe && typeof window !== 'undefined') {
      window.localStorage?.setItem(
        'cs-lms-demo-session',
        JSON.stringify({ email: normalizedEmail, timestamp: Date.now() }),
      );
    }
  };

  const authenticateDemoUser = (emailValue, passwordValue) => {
    const normalizedEmail = emailValue.trim().toLowerCase();
    const normalizedPassword = passwordValue.trim();
    const isValid =
      normalizedEmail === SAMPLE_CREDENTIALS.email && normalizedPassword === SAMPLE_CREDENTIALS.password;

    if (!isValid) {
      setSuccess(false);
      setErrorMessage('بيانات الدخول غير مطابقة لحساب التجربة. تأكد من البريد وكلمة المرور.');
      setSubmitting(false);
      return;
    }

    setErrorMessage('');
    setSuccess(true);
    persistDemoSession(normalizedEmail);

    window.setTimeout(() => {
      setSubmitting(false);
      navigate('/', { replace: true });
    }, 700);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting) {
      return;
    }
    setSubmitting(true);
    authenticateDemoUser(email, password);
  };

  const handleQuickDemoAccess = () => {
    if (submitting) {
      return;
    }
    setEmail(SAMPLE_CREDENTIALS.email);
    setPassword(SAMPLE_CREDENTIALS.password);
    setRememberMe(true);
    setSubmitting(true);
    authenticateDemoUser(SAMPLE_CREDENTIALS.email, SAMPLE_CREDENTIALS.password);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.8,
          ...heroGlow,
        }}
      />
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        sx={{
          width: '100%',
          maxWidth: 1180,
          alignItems: 'stretch',
        }}
      >
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: -26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundImage:
                'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.74) 45%, rgba(15, 118, 110, 0.22) 110%)',
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SecurityRounded color="primary" />
                <Typography variant="h5" fontWeight={700}>
                  بوابة المتدربين CyberShield
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                سجّل دخولك إلى نظام التعلّم الدفاعي للحصول على التدريبات والهجمات الموجهة، ومراقبة التقدم عبر التقارير اللحظية.
              </Typography>
              <Stack spacing={2.5}>
                {featurePillars.map(({ title, description, icon: Icon }) => (
                  <Stack
                    key={title}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: 'rgba(15, 23, 42, 0.64)',
                      border: '1px solid rgba(56, 189, 248, 0.16)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'linear-gradient(140deg, rgba(56, 189, 248, 0.3), rgba(99, 102, 241, 0.24))',
                        boxShadow: '0 18px 42px -32px rgba(14, 165, 233, 0.8)',
                      }}
                    >
                      <Icon fontSize="medium" color="info" />
                    </Box>
                    <Stack spacing={0.75}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {description}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.14)', my: 2 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Chip
                  color="success"
                  label="جاهزية كاملة"
                  icon={<CheckCircleRounded />}
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="caption" color="text.secondary">
                  تمت المزامنة مع أنظمة التدريبات والمحاكاة اليومية.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Stack spacing={1}>
                <Chip
                  label="LMS Secure Access"
                  variant="outlined"
                  color="primary"
                  icon={<SecurityRounded />}
                  sx={{ alignSelf: 'flex-start' }}
                />
                <Typography variant="h4">تسجيل الدخول للمتعلم</Typography>
                <Typography variant="body2" color="text.secondary">
                  أدخل بيانات اعتمادك لاستقبال التمارين المخصصة، إشعارات الهجمات، ومستودع التقارير.
                </Typography>
              </Stack>
              {errorMessage && (
                <Alert
                  severity="error"
                  onClose={() => setErrorMessage('')}
                  sx={{ direction: 'rtl' }}
                >
                  {errorMessage}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ direction: 'rtl' }}>
                  تم التحقق من حساب التجربة، سيتم تحويلك إلى لوحة التحكم.
                </Alert>
              )}
              <Stack spacing={2} component="form" noValidate onSubmit={handleSubmit}>
                <TextField
                  label="البريد المؤسسي"
                  type="email"
                  required
                  fullWidth
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSuccess(false);
                  }}
                  autoComplete="email"
                  helperText="استخدم البريد التجريبي: test@soc.local"
                  disabled={submitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CheckCircleRounded
                          fontSize="small"
                          sx={{ color: emailMatchesDemo ? 'success.main' : 'text.disabled' }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="كلمة المرور / رمز الدخول"
                  type={showPassword ? 'text' : 'password'}
                  required
                  fullWidth
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setSuccess(false);
                  }}
                  autoComplete="current-password"
                  helperText="كلمة المرور التجريبية: Admin123456"
                  disabled={submitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                          disabled={submitting}
                        >
                          {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Switch
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      inputProps={{ 'aria-label': 'تذكرني' }}
                      disabled={submitting}
                    />
                    <Typography variant="body2" color="text.secondary">
                      تذكر بياناتي في الأجهزة الموثوقة
                    </Typography>
                  </Stack>
                  <Button size="small" color="info">نسيت كلمة المرور؟</Button>
                </Stack>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<KeyboardArrowLeftRounded />}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'جاري التحقق...' : 'دخول إلى مساحة التعلم'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  endIcon={<BoltRounded />}
                  type="button"
                  onClick={handleQuickDemoAccess}
                  disabled={submitting}
                >
                  استخدام حساب التجربة الجاهز
                </Button>
              </Stack>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  بيانات الحساب التجريبي
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                  <Chip label="test@soc.local" size="small" color="primary" variant="outlined" />
                  <Chip label="Admin123456" size="small" color="secondary" variant="outlined" />
                  <Typography variant="caption" color="text.disabled">
                    ينقلك إلى لوحة القيادة لاستكشاف تجربة المتعلم الكاملة.
                  </Typography>
                </Stack>
              </Box>
              <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.14)' }} />
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="text.disabled">
                  الوصول يمنحك
                </Typography>
                <Grid container spacing={1.5}>
                  {[
                    'لوحة التمارين اليومية',
                    'تنبيهات الهجمات الحية',
                    'مختبرات الاستجابة للحوادث',
                    'تقارير الأداء الشخصية',
                    'مجتمعات التعلم التعاوني',
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleRounded fontSize="small" color="success" />
                        <Typography variant="body2" color="text.secondary">
                          {item}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LearnerLogin;
