import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 'auto',
      pt: 4,
      pb: 3,
      textAlign: 'center',
      color: 'text.secondary',
      borderTop: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" alignItems="center">
      <Typography variant="caption">
        © {new Date().getFullYear()} CyberShield Academy • منظومة التدريب السيبراني المتقدمة.
      </Typography>
      <Chip size="small" variant="outlined" label="إصدار المنصة 3.2" color="info" />
    </Stack>
  </Box>
);

export default Footer;
