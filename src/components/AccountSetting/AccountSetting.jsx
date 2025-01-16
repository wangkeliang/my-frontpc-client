import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccountSidebar from '../AccountSidebar/AccountSidebar';
import PlanCurrent from '../PlanCurrent/PlanCurrent';
import PlanSelect from '../PlanSelect/PlanSelect';
import PlanDetail from '../PlanDetail/PlanDetail';
import AccountNavigateBar from '../AccountNavigateBar/AccountNavigateBar'; // 引入导航栏组件

const AccountSetting = () => {
  return (
    <Box display="flex" minHeight="100vh">
      {/* 左侧菜单 */}
      <Box
        width="20%"
        sx={{
          borderRight: '1px solid #90caf9',
        }}
        p={2}
      >
        <AccountSidebar />
      </Box>

      {/* 右侧内容区域 */}
      <Box
        flex={1}
        sx={{
          background: 'linear-gradient(to bottom, #f9f9f9, #eaeaea)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 顶部导航条 */}
        <Box
          sx={{
            backgroundColor: '#ffffff',
            padding: '0px 0px',
            borderBottom: '0px solid #ddd',
          }}
        >
          <AccountNavigateBar />
        </Box>

        {/* 主体内容区域 */}
        <Box
          flex={1}
          p={4}
          sx={{
            borderRadius: 0,
            boxShadow: 'inset 0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="plan/current" replace />} />
            <Route path="plan/current" element={<PlanCurrent />} />
            <Route path="plan/history" element={<div>プラン履歴</div>} />
            <Route path="plan/select" element={<PlanSelect />} />
            <Route path="plan/select/detail/:planCode" element={<PlanDetail />} />
            <Route path="orders/list" element={<div>注文一覧</div>} />
            <Route path="invoices/list" element={<div>請求一覧</div>} />
            <Route path="payments/settings" element={<div>決済設定</div>} />
            <Route path="payments/pending" element={<div>支払待</div>} />
            <Route path="payments/history" element={<div>決済履歴</div>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSetting;
