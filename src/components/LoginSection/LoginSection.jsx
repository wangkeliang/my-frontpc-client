import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function LoginSection() {
  return (
    <Box
      sx={{
        mt: 2,
        width: '100%', // 确保与上方组件宽度一致
        maxWidth: 480, // 限制最大宽度
        mx: 'auto', // 居中对齐
        textAlign: 'center',
        bgcolor: '#B3E5FC', // 设置水色背景
        borderRadius: 2,
        boxShadow: 1,
        padding: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          mb: 1,
          fontWeight: 500, // 设置字体加粗
          fontFamily: 'Roboto, Arial, sans-serif', // 使用专业字体
          color: 'text.primary',
        }}
      >
        すでにアカウントをお持ちの方
      </Typography>
      <Link
        href="/login"
        variant="body1"
        sx={{
          textDecoration: 'none',
          fontWeight: 600, // 更加突出
          fontFamily: 'Roboto, Arial, sans-serif', // 使用专业字体
          color: 'primary.main',
          '&:hover': {
            textDecoration: 'underline',
            color: 'primary.dark',
          },
        }}
      >
        ログインページへ
      </Link>
    </Box>
  );
}

export default LoginSection;
