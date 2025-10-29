import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Paper, TextField, Tooltip, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Search } from '@mui/icons-material';

const ActionsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const SearchBar = ({ value, placeholder, onChange, onSearch, actions, disabled }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 3, border: '1px solid rgba(148, 163, 184, 0.4)' }}>
      <TextField
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        fullWidth
        disabled={disabled}
        InputProps={{
          startAdornment: <Search color="action" sx={{ mr: 1 }} />,
          sx: { borderRadius: 2 },
        }}
        size="small"
      />
      {actions?.length ? (
        <ActionsWrapper>
          {actions.map((action) => (
            <Tooltip key={action.id ?? action.label} title={action.tooltip ?? action.label}>
              <span>
                <IconButton
                  onClick={action.onClick}
                  color={action.color || 'primary'}
                  size={isSmall ? 'small' : 'medium'}
                  disabled={action.disabled}
                >
                  {action.icon}
                </IconButton>
              </span>
            </Tooltip>
          ))}
        </ActionsWrapper>
      ) : null}
    </Paper>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary', 'success', 'info', 'warning', 'error']),
      onClick: PropTypes.func,
      tooltip: PropTypes.string,
      disabled: PropTypes.bool,
    }),
  ),
  disabled: PropTypes.bool,
};

SearchBar.defaultProps = {
  value: '',
  placeholder: 'ابحث هنا...',
  onChange: undefined,
  onSearch: undefined,
  actions: [],
  disabled: false,
};

export default SearchBar;
