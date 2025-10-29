import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../../routes/navigation';

const drawerWidth = 280;

const linkStyles = ({ isActive }) => ({
  borderRadius: '16px',
  marginInline: '0.65rem',
  marginBlock: '0.25rem',
  paddingInline: '0.85rem',
  paddingBlock: '0.5rem',
  fontWeight: isActive ? 700 : 500,
  color: isActive ? '#38bdf8' : 'inherit',
  background: isActive ? 'linear-gradient(120deg, rgba(56, 189, 248, 0.16), rgba(99, 102, 241, 0.06))' : 'transparent',
  textDecoration: 'none',
});

const SidebarContent = () => (
  <Box sx={{ direction: 'rtl', height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Toolbar sx={{ px: 3, py: 4, alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.disabled', letterSpacing: '0.18em' }}>
          CYBERSHIELD
        </Typography>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          لوحة التحكم التنفيذية
        </Typography>
        <Chip
          color="success"
          size="small"
          label="حالة التشغيل: مستقرة"
          sx={{ alignSelf: 'flex-start' }}
        />
      </Box>
    </Toolbar>
    <Divider variant="middle" />
    <List sx={{ px: 1, py: 2, flex: 1 }}>
      {NAVIGATION_ITEMS.map((item) => {
        const IconComponent = item.icon;
        return (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            style={linkStyles}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      })}
    </List>
    <Divider variant="middle" />
    <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        آخر تحديث متزامن منذ 3 دقائق.
      </Typography>
      <Chip label="تشغيل الوضع الآمن" size="small" variant="outlined" color="info" sx={{ alignSelf: 'flex-start' }} />
    </Box>
  </Box>
);

const Sidebar = ({ mobileOpen, onClose, visible }) => {
  if (!visible) {
    return <Box component="nav" sx={{ width: { md: 0 }, flexShrink: { md: 0 } }} aria-label="navigation" />;
  }

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="navigation">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderInline: 'none',
            backgroundImage: 'linear-gradient(160deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.78) 100%)',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderInline: 'none',
            backgroundImage: 'linear-gradient(155deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.78) 70%, rgba(8, 145, 178, 0.12) 120%)',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

Sidebar.defaultProps = {
  visible: true,
};

export default Sidebar;
