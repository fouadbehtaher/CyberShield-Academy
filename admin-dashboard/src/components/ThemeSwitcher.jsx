import React, { useState } from 'react';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { FormControlLabel, IconButton, Menu, MenuItem, Switch } from '@mui/material';

const ThemeSwitcher = ({ darkMode = false, onThemeToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = () => {
    onThemeToggle?.(!darkMode);
  };

  return (
    <div className="theme-switcher">
      <IconButton onClick={handleClick} aria-label="تغيير السمة">
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem>
          <FormControlLabel control={<Switch checked={darkMode} onChange={handleToggle} />} label={darkMode ? 'الوضع المظلم' : 'الوضع الفاتح'} />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ThemeSwitcher;
