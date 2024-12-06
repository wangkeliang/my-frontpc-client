import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function LoginFooterCmp() {
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

      {/* 链接部分 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5, // 链接间距
        }}
      >
        <Link
          href="/privacy-policy"
          sx={{
            color: '#007bff',
            textDecoration: 'none',
            '&:hover': { color: '#0056b3' },
          }}
        >
          プライバシーポリシー
        </Link>
        <Typography
          component="span"
          sx={{
            color: '#ccc',
            marginX: '5px', // 竖线左右间距
          }}
        >
          |
        </Typography>
        <Link
          href="/terms-of-service"
          sx={{
            color: '#007bff',
            textDecoration: 'none',
            '&:hover': { color: '#0056b3' },
          }}
        >
          利用規約
        </Link>
        <Typography
          component="span"
          sx={{
            color: '#ccc',
            marginX: '5px', // 竖线左右间距
          }}
        >
          |
        </Typography>
        <Link
          href="/contact"
          sx={{
            color: '#007bff',
            textDecoration: 'none',
            '&:hover': { color: '#0056b3' },
          }}
        >
          お問い合わせ
        </Link>
      </Box>
    </Box>
  );
}

export default LoginFooterCmp;
