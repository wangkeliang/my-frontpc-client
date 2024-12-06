import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginFormCmp from '../../components/LoginFormCmp/LoginFormCmp';
import PromoPanelCmp from '../../components/PromoPanelCmp/PromoPanelCmp';
import LoginFooterCmp from '../../components/LoginFooterCmp/LoginFooterCmp';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

function LoginPage() {
  const navigate = useNavigate();
  const { userId, webSocketSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('***userId=', userId);
    console.log('***webSocketSuccess=', webSocketSuccess);
    if (userId && webSocketSuccess) {
      navigate('/main');
    }
  }, [userId, webSocketSuccess, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Logo 部分 */}
      <Box
        sx={{
          position: 'absolute', // 绝对定位，左上角
          top: 16,
          left: 16,
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          style={{
            width: '8vw',
            height: '8vw',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* 主内容部分 */}
      <Grid
        container
        sx={{
          flex: 1, // 主内容占据剩余空间
          backgroundColor: '#F8F9FA', // 左侧背景白色或浅灰色
        }}
      >
        {/* 左侧内容 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              // backgroundColor: 'blue', // 保留蓝色背景
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FFFFFF', // 白色背景更干净
            }}
          >
            <LoginFormCmp />
          </Box>
        </Grid>

        {/* 右侧内容 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #79C2F2, #4A90E2)', // 浅蓝渐变
              color: '#FFFFFF', // 文字颜色统一改为白色
            }}
          >
            <PromoPanelCmp />
          </Box>
        </Grid>
      </Grid>

      {/* 页脚部分 */}
      <Box
      sx={{
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
      }}
          >
        <LoginFooterCmp />
      </Box>
    </Box>
  );
}

export default LoginPage;
