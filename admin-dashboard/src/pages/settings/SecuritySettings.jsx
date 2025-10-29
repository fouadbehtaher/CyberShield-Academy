import React from 'react';
import {
  Box,
  CardContent,
  Collapse,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';
import GlobalOperationsBar from '../../components/layout/GlobalToolbar/GlobalOperationsBar';
import AnimatedCard from '../../components/advanced/AnimatedCard.jsx';
const SecuritySettings = () => {
  const [showSyncCenter, setShowSyncCenter] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4">الإعدادات المتقدمة</Typography>
      <Typography variant="body1" color="text.secondary">
        تحكم في سياسات الأمان، وإشعارات الامتثال، والتكامل مع الأنظمة الخارجية.
      </Typography>

      <Stack spacing={2}>
        <Button
          variant={showSyncCenter ? 'outlined' : 'contained'}
          color="info"
          onClick={() => setShowSyncCenter((prev) => !prev)}
        >
          {showSyncCenter ? 'إخفاء مركز المزامنة الفوري' : 'عرض مركز المزامنة الفوري'}
        </Button>
        <Collapse in={showSyncCenter} timeout="auto" unmountOnExit>
          <GlobalOperationsBar />
        </Collapse>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnimatedCard animation="rise">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>سياسات المصادقة</Typography>
              <Stack spacing={2}>
                <FormControlLabel control={<Switch defaultChecked />} label="تفعيل المصادقة المتعددة MFA" />
                <FormControlLabel control={<Switch defaultChecked />} label="تعزيز كلمات المرور الذكية" />
                <TextField label="مدة صلاحية الجلسة (بالدقائق)" type="number" defaultValue={45} />
              </Stack>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard delay={0.06}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>إشعارات الامتثال</Typography>
              <Stack spacing={2}>
                <FormControlLabel control={<Switch defaultChecked />} label="تفعيل تنبيهات SOC" />
                <FormControlLabel control={<Switch />} label="إشعارات البريد الإلكتروني للمديرين" />
                <TextField label="عنوان Webhook لخدمة SIEM" placeholder="https://siem.cybershield/api/hooks" />
              </Stack>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>

      <Button variant="contained" startIcon={<SaveOutlined />} sx={{ alignSelf: 'flex-start' }}>
        حفظ التغييرات
      </Button>
    </Box>
  );
};

export default SecuritySettings;
