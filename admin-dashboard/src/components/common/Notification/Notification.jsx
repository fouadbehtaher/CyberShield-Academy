import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Snackbar } from '@mui/material';

const Notification = ({ open, message, severity, onClose, autoHideDuration }) => (
  <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

Notification.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  onClose: PropTypes.func,
  autoHideDuration: PropTypes.number,
};

Notification.defaultProps = {
  open: false,
  message: '',
  severity: 'info',
  onClose: undefined,
  autoHideDuration: 4000,
};

export default Notification;
