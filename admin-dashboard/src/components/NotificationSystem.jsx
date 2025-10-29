import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Close, Notifications, School, Security, Warning } from '@mui/icons-material';

const NOTIFICATION_TYPES = {
  security: {
    icon: <Security color="error" />,
    defaultMessage: 'تنبيه أمني جديد تم اكتشافه.',
  },
  learning: {
    icon: <School color="primary" />,
    defaultMessage: 'تمت إضافة محتوى تعليمي جديد لمسار التدريب.',
  },
  system: {
    icon: <Warning color="warning" />,
    defaultMessage: 'النظام اكتشف حدثاً يحتاج إلى المتابعة.',
  },
};

const MAX_VISIBLE = 6;

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState(() => []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const typeKeys = Object.keys(NOTIFICATION_TYPES);
      const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
      const payload = NOTIFICATION_TYPES[randomType];

      setNotifications((current) => [
        {
          id: crypto.randomUUID(),
          type: randomType,
          message: payload.defaultMessage,
          timestamp: new Date(),
          read: false,
        },
        ...current,
      ]);
      setSnackbarOpen(true);
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  useEffect(() => {
    if (unreadCount > 0) {
      setSnackbarOpen(true);
    }
  }, [unreadCount]);

  const handleDrawerToggle = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // يمكن إضافة منطق التنقل أو عرض التفاصيل هنا
  };

  const visibleNotifications = notifications.slice(0, MAX_VISIBLE);

  return (
    <div className="notification-system">
      <Tooltip title="الإشعارات">
        <IconButton onClick={handleDrawerToggle(true)} aria-label="عرض الإشعارات">
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 360 },
            backgroundImage: 'linear-gradient(165deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.88))',
            border: 'none',
            backdropFilter: 'blur(24px)',
            color: '#e2e8f0',
          },
        }}
      >
        <Stack spacing={0} sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2.25 }}>
            <Typography variant="h6">الإشعارات</Typography>
            <IconButton size="small" onClick={handleDrawerToggle(false)} aria-label="إغلاق لوحة الإشعارات">
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.15)' }} />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List dense disablePadding>
              {visibleNotifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="لا توجد إشعارات جديدة" />
                </ListItem>
              ) : (
                visibleNotifications.map((notification) => {
                  const meta = NOTIFICATION_TYPES[notification.type] ?? {
                    icon: <Notifications />,
                  };

                  return (
                    <ListItem key={notification.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                          alignItems: 'flex-start',
                          py: 1.5,
                          px: 2,
                          bgcolor: notification.read ? 'transparent' : 'rgba(15, 118, 110, 0.1)',
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 44 }}>{meta.icon}</ListItemIcon>
                        <ListItemText
                          primary={notification.message}
                          secondary={notification.timestamp.toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })
              )}
            </List>
          </Box>
        </Stack>
      </Drawer>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          لديك إشعارات جديدة غير مقروءة
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotificationSystem;
