import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const Toast = ({
  open,
  message,
  severity = 'info',
  duration = 3000,
  onClose,
  vertical = 'top',
  horizontal = 'center',
}) => {
  useEffect(() => {
    console.log('Toast component mounted or updated');
    return () => console.log('Toast component unmounted');
  }, [open, message, severity]);

  // 处理关闭逻辑
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      console.log('Snackbar closed by clickaway');
      return; // 忽略点击背景关闭的动作
    }
    console.log('Snackbar closing:', reason);
    onClose(); // 调用关闭逻辑
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration} // 自动隐藏时长（以毫秒为单位）
      onClose={handleSnackbarClose} // 处理关闭逻辑
      anchorOrigin={{ vertical, horizontal }} // 位置参数
      sx={{
        zIndex: 1200, // 确保显示在前景
        pointerEvents: 'auto', // 允许交互
      }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
