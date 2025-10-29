import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h3">¯\\_(ツ)_/¯</Typography>
      <Typography variant="h5">الصفحة غير موجودة</Typography>
      <Typography variant="body1" color="text.secondary">
        الرابط الذي تحاول الوصول إليه غير متاح. تأكد من العنوان أو عد إلى لوحة التحكم الرئيسية.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>العودة إلى لوحة التحكم</Button>
    </Box>
  );
};

export default NotFound;
