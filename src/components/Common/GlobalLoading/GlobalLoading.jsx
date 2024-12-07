import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';

const GlobalLoading = () => {
  const isGlobalLoading = useSelector((state) => state.loading.isGlobalLoading); // 从 Redux 获取全局加载状态

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1, // 确保在最高层级
        // backgroundColor: 'rgba(0, 0, 0, 0.8)', // 设置不透明背景色
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // 设置不透明背景色
      }}
      open={isGlobalLoading} // 根据状态决定是否显示
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalLoading;
