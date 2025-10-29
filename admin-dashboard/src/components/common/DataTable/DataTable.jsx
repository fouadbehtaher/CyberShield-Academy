import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

const DataTable = ({ columns, rows, rowKey, emptyMessage, actions, dense }) => {
  if (!rows.length) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed rgba(148, 163, 184, 0.4)', borderRadius: 3 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
      <Table size={dense ? 'small' : 'medium'} sx={{ '& thead th': { fontWeight: 600, bgcolor: 'rgba(15, 23, 42, 0.04)' } }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} align={column.align ?? 'right'} width={column.width}>
                {column.label}
              </TableCell>
            ))}
            {actions?.length ? <TableCell align="center">إجراءات</TableCell> : null}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[rowKey]} hover sx={{ '&:last-of-type td, &:last-of-type th': { borderBottom: 0 } }}>
              {columns.map((column) => {
                const cellValue = row[column.field];
                if (column.render) {
                  return (
                    <TableCell key={column.field} align={column.align ?? 'right'}>
                      {column.render(row)}
                    </TableCell>
                  );
                }

                if (column.type === 'chip') {
                  return (
                    <TableCell key={column.field} align={column.align ?? 'right'}>
                      <Chip label={cellValue} size="small" color={column.color || 'default'} variant={column.variant || 'outlined'} />
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={column.field} align={column.align ?? 'right'}>
                    {column.format ? column.format(cellValue, row) : cellValue}
                  </TableCell>
                );
              })}

              {actions?.length ? (
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {actions.map((action) => {
                      const disabled = typeof action.disabled === 'function' ? action.disabled(row) : action.disabled;
                      return (
                        <Tooltip key={action.id ?? action.label} title={action.tooltip ?? action.label}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => action.onClick?.(row)}
                              color={action.color || 'primary'}
                              disabled={disabled}
                            >
                              {action.icon}
                            </IconButton>
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Box>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'right', 'center']),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.oneOf(['chip']),
      color: PropTypes.string,
      variant: PropTypes.oneOf(['outlined', 'filled']),
      format: PropTypes.func,
      render: PropTypes.func,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowKey: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary', 'success', 'info', 'warning', 'error']),
      tooltip: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    }),
  ),
  dense: PropTypes.bool,
};

DataTable.defaultProps = {
  emptyMessage: 'لا توجد بيانات متاحة.',
  actions: [],
  dense: false,
};

export default DataTable;
