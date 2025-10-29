import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const Modal = ({ open, onClose, title, children, actions, maxWidth }) => (
  <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
    {title ? (
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton onClick={onClose} size="small" aria-label="إغلاق">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
    ) : null}

    <DialogContent dividers>{children}</DialogContent>

    {actions?.length ? (
      <DialogActions sx={{ px: 3, py: 2 }}>
        {actions.map((action) => (
          <Button
            key={action.id ?? action.label}
            onClick={action.onClick}
            variant={action.variant || 'contained'}
            color={action.color || 'primary'}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    ) : null}
  </Dialog>
);

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
      color: PropTypes.oneOf(['inherit', 'primary', 'secondary', 'success', 'info', 'warning', 'error']),
      disabled: PropTypes.bool,
    }),
  ),
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
};

Modal.defaultProps = {
  title: undefined,
  actions: [],
  maxWidth: 'md',
};

export default Modal;
