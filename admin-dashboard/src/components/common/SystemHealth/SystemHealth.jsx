import React from 'react';
import PropTypes from 'prop-types';
import { Box, CardContent, Chip, Grid, LinearProgress, Typography } from '@mui/material';
import AnimatedCard from '../../advanced/AnimatedCard.jsx';

const statusPalette = {
  excellent: { label: 'ممتاز', color: 'success', progress: 95 },
  good: { label: 'جيد', color: 'primary', progress: 80 },
  caution: { label: 'يتطلب متابعة', color: 'warning', progress: 56 },
  critical: { label: 'مرتفع الخطورة', color: 'error', progress: 22 },
};

const SystemHealth = ({ metrics }) => {
  const items = metrics.length
    ? metrics
    : [
        { name: 'صحة البنية التحتية', status: 'excellent', description: 'الخوادم الأساسية تعمل ضمن الحدود الطبيعية.' },
        { name: 'امتثال المتدربين', status: 'good', description: '82% من المتدربين أنهوا مهام الأسبوع الحالي.' },
        { name: 'تنبيهات SOC', status: 'caution', description: '3 تنبيهات بحاجة مراجعة خلال الساعات المقبلة.' },
        { name: 'مؤشر محاولات التسلل', status: 'critical', description: 'ارتفاع ملحوظ في حركة الهجمات من مناطق محددة.' },
      ];

  return (
    <Grid container spacing={3}>
      {items.map((item, index) => {
        const palette = statusPalette[item.status] || statusPalette.good;
        return (
          <Grid item xs={12} md={3} key={item.name}>
            <AnimatedCard animation="zoom" delay={0.05 + index * 0.05} sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Chip size="small" color={palette.color} label={palette.label} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.progress ?? palette.progress}
                    sx={{ height: 8, borderRadius: 9999 }}
                    color={palette.color}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    مستوى الصحة {Math.round(item.progress ?? palette.progress)}%
                  </Typography>
                </Box>
              </CardContent>
            </AnimatedCard>
          </Grid>
        );
      })}
    </Grid>
  );
};

SystemHealth.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['excellent', 'good', 'caution', 'critical']).isRequired,
      description: PropTypes.string.isRequired,
      progress: PropTypes.number,
    }),
  ),
};

SystemHealth.defaultProps = {
  metrics: [],
};

export default SystemHealth;
