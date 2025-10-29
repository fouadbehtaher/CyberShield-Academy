import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const RealTimeChart = ({ data, height = 140, color = '#26a69a' }) => {
  const points = useMemo(() => {
    if (!data.length) {
      return [];
    }

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    const chartWidth = 320;
    const paddingX = 16;
    const paddingY = 12;
    const chartHeight = height - paddingY * 2;

    return {
      chartWidth,
      paddingX,
      paddingY,
      chartHeight,
      dots: data.map((value, index) => {
        const xRatio = data.length === 1 ? 0.5 : index / (data.length - 1);
        const x = paddingX + xRatio * (chartWidth - paddingX * 2);
        const y = paddingY + (1 - (value - minValue) / range) * chartHeight;
        return { x, y, value };
      }),
    };
  }, [data, height]);

  if (!data.length) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary" align="center">
          لا توجد عينات لحظية.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <svg viewBox={`0 0 ${points.chartWidth} ${height}`} role="img" aria-label="سجل لحظي" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.65" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={points.dots
            .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
            .join(' ')}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <path
          d={`${points.dots
            .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
            .join(' ')} L ${points.dots[points.dots.length - 1].x.toFixed(1)} ${height - points.paddingY} L ${points.dots[0].x.toFixed(1)} ${height - points.paddingY} Z`}
          fill="url(#sparkGradient)"
          opacity={0.4}
        />
      </svg>
    </Box>
  );
};

RealTimeChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default RealTimeChart;
