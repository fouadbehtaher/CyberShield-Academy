import React from 'react';
import PropTypes from 'prop-types';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';

const Pagination = ({ count, page, onChange, label }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, py: 1 }}>
    {label ? (
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    ) : null}
    <MuiPagination count={count} page={page} onChange={(_, newPage) => onChange?.(newPage)} color="primary" />
  </Box>
);

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

Pagination.defaultProps = {
  onChange: undefined,
  label: undefined,
};

export default Pagination;
