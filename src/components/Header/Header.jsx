import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Box, Tabs, Tab, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserMenu from '../UserMenu/UserMenu'; // 引入 UserMenu 组件

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const permissionInfo = useSelector((state) => state.permissions.permissioninfo); // Permissions
  const [menuAnchor, setMenuAnchor] = useState(null); // For dropdown menu
  const [overflowTabs, setOverflowTabs] = useState([]); // Tabs that overflow
  const tabsContainerRef = useRef(null); // Ref for Tabs container
  const visibleTabs = useRef([]); // For tabs that are visible in the Tabs component

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

  const activeTab = tabsConfig.find((tab) => location.pathname.includes(tab.value))?.value || false;

  const isTabVisible = (tabId) => permissionInfo?.Tab?.[tabId] === 1;

  const handleTabChange = (event, newValue) => {
    navigate(`/main/${newValue}`);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const calculateOverflowTabs = () => {
    const containerWidth = tabsContainerRef.current?.offsetWidth || 0;
    const tabs = Array.from(tabsContainerRef.current?.querySelectorAll('.MuiTab-root') || []);
    let currentWidth = 0;
    const visible = [];
    const overflow = [];

    tabs.forEach((tab, index) => {
      currentWidth += tab.offsetWidth;
      if (currentWidth <= containerWidth) {
        visible.push(tabsConfig[index]);
      } else {
        overflow.push(tabsConfig[index]);
      }
    });

    visibleTabs.current = visible;
    setOverflowTabs(overflow);
  };

  useEffect(() => {
    calculateOverflowTabs();
    window.addEventListener('resize', calculateOverflowTabs);

    return () => {
      window.removeEventListener('resize', calculateOverflowTabs);
    };
  }, [permissionInfo]);

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        width: '100%',
        borderBottom: '0px solid silver', // 设置底部边框颜色为银色
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component="div" sx={{ mr: 3, fontWeight: 'bold' }}>
            Logo
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Box ref={tabsContainerRef} flexGrow={1} sx={{ overflow: 'hidden', display: 'flex' }}>
          <Tabs
            value={activeTab || false}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="navigation tabs"
            sx={{ minHeight: 48 }}
          >
            {tabsConfig
              .filter((tab) => isTabVisible(tab.id) && !overflowTabs.includes(tab))
              .map((tab) => (
                <Tab
                  key={tab.id}
                  label={tab.label}
                  value={tab.value}
                  sx={{
                    textTransform: 'none',
                    fontWeight: activeTab === tab.value ? 'bold' : 'normal',
                    minHeight: 48,
                  }}
                />
              ))}
          </Tabs>

          {/* Overflow Menu Icon */}
          {overflowTabs.length > 0 && (
            <IconButton
              onClick={handleMenuOpen}
              sx={{ display: 'block', ml: 2 }}
              aria-label="More tabs"
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {overflowTabs.map((tab) => (
              <MenuItem
                key={tab.id}
                onClick={() => {
                  navigate(`/main/${tab.value}`);
                  handleMenuClose();
                }}
              >
                {tab.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Right Section: Utility Icons */}
        <Box display="flex" alignItems="center" gap={2}>
          {permissionInfo?.UtilityMenu?.UtilityMenu_Help && (
            <IconButton aria-label="help">
              <HelpIcon />
            </IconButton>
          )}

          {permissionInfo?.UtilityMenu?.UtilityMenu_Settings && (
            <IconButton aria-label="settings">
              <SettingsIcon />
            </IconButton>
          )}

          {permissionInfo?.UtilityMenu?.UtilityMenu_Notifications && (
            <IconButton aria-label="notifications">
              <NotificationsIcon />
            </IconButton>
          )}

          {permissionInfo?.UtilityMenu?.UtilityMenu_UserMenu && <UserMenu />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
