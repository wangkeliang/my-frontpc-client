import React, { useState } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Person from '@mui/icons-material/Person';
import { logoutUser } from '../../redux/auth/authSlice'; // 引入 Redux 中的 logoutUser 异步操作
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { handleLogout } from '../../services/logoutHandler';
// import { showGlobalLoading, hideGlobalLoading } from '../../redux/loading/loadingSlice.js'; 
const UserMenu = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
// 从 Redux store 中获取 auth 和 user 状态

const userId = useSelector((state) => state.auth.userId);
const userInfo = useSelector((state) => state.user.userInfo);
console.log('***userInfo',userInfo);
// 动态获取用户信息
const firstName = userInfo?.firstName ;
const lastName = userInfo?.lastName;
const email = userInfo?.email;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

 
  if (!userId){
    return null;
  }

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
            {/* 上方的 Avatar */}
            <Avatar sx={{ width: 32, height: 32 }}>{lastName[0] || "U"}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock // 禁用滚动锁定
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
        {/* 用户基本信息部分 */}
        <MenuItem
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* 用户头像 */}
          <Avatar sx={{ width: 40, height: 40 }}>
            {lastName[0] || "U"}
          </Avatar>

          {/* 用户信息 */}
          <Box>
            {/* 用户名 */}
            <Typography 
              variant="body1" 
              sx={{ fontWeight: 'bold' }}
            >
              {lastName} {firstName}
            </Typography>

            {/* 用户邮箱 */}
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              {email}
            </Typography>

            {/* 用户 ID */}
            <Typography 
              variant="caption" 
              color="text.secondary"
            >
              ID: {userId}
            </Typography>
          </Box>
        </MenuItem>

        <Divider />

        {/* 功能菜单 */}
        <MenuItem>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Person fontSize="small" />
          </ListItemIcon>
          プロファイル
        </MenuItem>
        <MenuItem>
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
        <MenuItem onClick={() => handleLogout(dispatch, setAnchorEl)}>
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
