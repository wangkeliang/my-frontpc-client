import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Person from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../services/logoutHandler'; // 保留登出逻辑

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const userInfo = useSelector((state) => state.user.userInfo);

  const firstName = userInfo?.firstName;
  const lastName = userInfo?.lastName;
  const email = userInfo?.email;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountClick = () => {
    navigate('/main/account'); // 导航到 AccountSetting
  
  };

  const handleProfileClick = () => {
    console.log('Navigating to Profile...');
    // 可添加实际的逻辑，比如 navigate 到 /main/profile
    handleClose();
  };

  const handleLogoutClick = () => {
    handleLogout(dispatch); // 调用登出逻辑
    handleClose();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{lastName?.[0] || 'U'}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* 用户信息 */}
        <MenuItem>
          <Avatar sx={{ width: 40, height: 40 }}>{lastName?.[0] || 'U'}</Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {lastName} {firstName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />

        {/* 功能菜单 */}
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Person fontSize="small" />
          </ListItemIcon>
          プロファイル
        </MenuItem>
        <MenuItem onClick={handleAccountClick}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <AccountBalanceWalletIcon fontSize="small" />
          </ListItemIcon>
          アカウント
        </MenuItem>
        <MenuItem>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          個人設定
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          ログアウト
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default UserMenu;
