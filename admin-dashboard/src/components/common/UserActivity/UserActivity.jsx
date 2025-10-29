import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

const activitySeverity = {
  high: { label: 'عالي الأولوية', color: 'error' },
  medium: { label: 'متوسط', color: 'warning' },
  low: { label: 'اعتيادي', color: 'default' },
};

const UserActivity = ({ data }) => {
  if (!data.length) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary" align="center">
          لا توجد نشاطات مسجلة حديثًا.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ direction: 'rtl' }}>
      {data.map((item, index) => {
        const status = activitySeverity[item.severity] ?? activitySeverity.medium;
        return (
          <React.Fragment key={item.user + index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{item.user.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.timestamp}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.action}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label={status.label} color={status.color} variant={status.color === 'default' ? 'outlined' : 'filled'} />
                      {item.tags?.map((tag) => (
                        <Chip key={tag} size="small" label={tag} variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < data.length - 1 && <Divider component="li" variant="middle" />}
          </React.Fragment>
        );
      })}
    </List>
  );
};

UserActivity.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
      severity: PropTypes.oneOf(['high', 'medium', 'low']),
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
};

export default UserActivity;
