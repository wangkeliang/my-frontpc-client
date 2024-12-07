// src/components/Footer/Footer.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f9f9f9',
        padding: '3px',
        // borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
      }}
    >
      {/* 页脚文字 */}
      <Typography
        variant="body2"
        sx={{
          color: '#777',
          marginBottom: '2px',
        }}
      >
        &copy; 2025 Star Sky株式会社. All rights reserved.
      </Typography>

     
    </Box>
  );
}

export default Footer;
