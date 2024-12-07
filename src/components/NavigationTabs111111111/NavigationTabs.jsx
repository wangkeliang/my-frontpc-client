import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/mainLayout/tabSlice';
import { Tabs, Tab, Box } from '@mui/material';

const NavigationTabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tab); // 从 Redux 中获取 activeTab
  const permissionInfo = useSelector((state) => state.permissions.permissioninfo); // 获取权限信息

  // 判断某个 Tab 是否有权限显示
  const isTabVisible = (tabId) => {
    return permissionInfo?.Tab?.[tabId] === 1; // 根据权限信息判断是否显示
  };

  // Tab 配置数组
  const tabsConfig = [
    { id: 'HomeTab', label: 'ホーム', value: 'Home' },
    { id: 'CaseTab', label: '案件', value: 'Case' },
    { id: 'CandidateTab', label: '人材', value: 'Candidate' },
    { id: 'PartnerTab', label: 'パートナ', value: 'Partner' },
    { id: 'MeetingTab', label: '会議', value: 'Meeting' },
    { id: 'MailTab', label: 'メール送信', value: 'Mail' },
    { id: 'ReportTab', label: 'レポート', value: 'Report' },
    { id: 'BulletinBoardTab', label: '掲示板', value: 'BulletinBoard' },
  ];

  const handleTabChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="navigation tabs"
        sx={{ minHeight: 48 }}
      >
        {tabsConfig.map(
          (tab) =>
            isTabVisible(tab.id) && (
              <Tab
                key={tab.id}
                label={tab.label}
                value={tab.value}
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === tab.value ? 'bold' : 'normal',
                  minHeight: 48,
                  minWidth: 100,
                }}
              />
            )
        )}
      </Tabs>
    </Box>
  );
};

export default NavigationTabs;
