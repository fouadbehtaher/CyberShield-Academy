import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const DEFAULT_HEIGHT = 220;
const DEFAULT_COLOR = '#0288d1';

const BarChart = ({ data, height = DEFAULT_HEIGHT, color = DEFAULT_COLOR, layout = 'vertical' }) => {
  const computed = useMemo(() => {
    const values = data.map((item) => Number(item.value));
    const maxValue = Math.max(...values, 1);
    return { values, maxValue };
  }, [data]);

  if (!data.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary" align="center">
          لا توجد بيانات متاحة للعرض حالياً.
        </Typography>
      </Box>
    );
  }

  if (layout === 'horizontal') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.map((item) => {
          const valueRatio = item.value / computed.maxValue;
          return (
            <Box key={item.label} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
              </Box>
              <Box sx={{ height: 10, bgcolor: 'rgba(2, 136, 209, 0.16)', borderRadius: 9999 }}>
                <Box sx={{ width: `${valueRatio * 100}%`, height: '100%', borderRadius: 9999, bgcolor: color, transition: 'width 0.4s ease' }} />
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  const barWidth = 36;
  const spacing = 24;
  const chartWidth = data.length * (barWidth + spacing) + spacing;
  const chartHeight = height - 40;

  return (
    <Box sx={{ width: '100%', height }}>
      <svg viewBox={`0 0 ${chartWidth} ${height}`} role="img" aria-label="مخطط أعمدة" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {data.map((item, index) => {
          const barHeight = (item.value / computed.maxValue) * chartHeight;
          const x = spacing + index * (barWidth + spacing);
          const y = height - 24 - barHeight;
          return (
            <g key={item.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} fill="url(#barGradient)" />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="rgba(15, 23, 42, 0.78)">
                {item.value}
              </text>
              <text x={x + barWidth / 2} y={height - 6} textAnchor="middle" fontSize="12" fill="rgba(15, 23, 42, 0.7)">
                {item.label}
              </text>
            </g>
          );
        })}

        <line x1={0} y1={height - 24} x2={chartWidth} y2={height - 24} stroke="rgba(148, 163, 184, 0.4)" />
      </svg>
    </Box>
  );
};

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  height: PropTypes.number,
  color: PropTypes.string,
  layout: PropTypes.oneOf(['vertical', 'horizontal']),
};

export default BarChart;
