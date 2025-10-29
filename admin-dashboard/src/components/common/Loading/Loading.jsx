import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ label, size }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 6 }}>
    <CircularProgress size={size} thickness={4} />
    {label ? (
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    ) : null}
  </Box>
);

Loading.propTypes = {
  label: PropTypes.string,
  size: PropTypes.number,
};

Loading.defaultProps = {
  label: 'جاري التحميل...',
  size: 48,
};

export default Loading;
