import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const DEFAULT_HEIGHT = 220;
const DEFAULT_COLOR = '#1976d2';

const toPath = (points) =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

const createAreaPath = (points, chartHeight) => {
  if (points.length === 0) {
    return '';
  }

  const baselineY = chartHeight;
  const linePath = toPath(points);
  const closingSegment = `L ${points[points.length - 1].x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`;
  return `${linePath} ${closingSegment}`;
};

const LineChart = ({ data, height = DEFAULT_HEIGHT, color = DEFAULT_COLOR, filled = true, showDots = true }) => {
  const chart = useMemo(() => {
    const values = data.map((item) => Number(item.value));
    const labels = data.map((item) => item.label);

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const normalizedRange = maxValue - minValue || 1;

    const paddingX = 32;
    const paddingY = 24;
    const chartWidth = 400;
    const chartHeight = height - paddingY * 2;
    const usableWidth = chartWidth - paddingX * 2;

    const points = values.map((value, index) => {
      const xRatio = data.length === 1 ? 0.5 : index / (data.length - 1);
      const yRatio = (value - minValue) / normalizedRange;

      return {
        x: paddingX + xRatio * usableWidth,
        y: paddingY + (1 - yRatio) * chartHeight,
        value,
        label: labels[index],
      };
    });

    return {
      points,
      chartWidth,
      chartHeight,
      paddingX,
      paddingY,
      minValue,
      maxValue,
    };
  }, [data, height]);

  if (!data.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary" align="center">
          لا توجد بيانات متاحة للعرض حالياً.
        </Typography>
      </Box>
    );
  }

  const { points, chartWidth, chartHeight, paddingX, paddingY, minValue, maxValue } = chart;

  return (
    <Box sx={{ width: '100%', height }}>
      <svg viewBox={`0 0 ${chartWidth} ${height}`} role="img" aria-label="مخطط خطي" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(148, 163, 184, 0.15)" />
            <stop offset="1" stopColor="rgba(148, 163, 184, 0)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = paddingY + ratio * chartHeight;
          return <line key={ratio} x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="4 6" />;
        })}

        {/* Area under line */}
        {filled && (
          <path d={createAreaPath(points, height - paddingY)} fill="url(#lineGradient)" />
        )}

        {/* Line */}
        <path d={toPath(points)} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {showDots &&
          points.map((point) => (
            <g key={point.x}>
              <circle cx={point.x} cy={point.y} r={5} fill="#fff" stroke={color} strokeWidth="2" />
              <text x={point.x} y={point.y - 12} textAnchor="middle" fontSize="11" fill={color}>
                {point.value}
              </text>
            </g>
          ))}

        {/* X Axis labels */}
        {points.map((point) => (
          <text key={point.label} x={point.x} y={height - 4} textAnchor="middle" fontSize="12" fill="rgba(15, 23, 42, 0.7)">
            {point.label}
          </text>
        ))}

        {/* Y Axis labels */}
        {[minValue, (minValue + maxValue) / 2, maxValue].map((value, index) => (
          <text key={value} x={paddingX - 12} y={paddingY + ((1 - index / 2) * chartHeight)} textAnchor="end" fontSize="11" fill="rgba(15, 23, 42, 0.6)">
            {Math.round(value)}
          </text>
        ))}
      </svg>
    </Box>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  height: PropTypes.number,
  color: PropTypes.string,
  filled: PropTypes.bool,
  showDots: PropTypes.bool,
};

export default LineChart;
