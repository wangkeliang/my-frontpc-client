// src/components/Header/Header.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import Logo from '../Logo/Logo';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import Help from '../Help/Help';
import Notifications from '../Notifications/Notifications';
import Settings from '../Settings/Settings';
import UserMenu from '../UserMenu/UserMenu';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import './Header.css';

const Header = () => {
  // 从 Redux 获取权限数据
  const permissions = useSelector((state) => state.permissions.permissioninfo);

  return (
    <header>
      <div className="slds-global-header slds-grid slds-grid_align-spread">
        {/* 左侧区域：Logo 和 NavigationTabs */}
        <div className="slds-global-header__item">
          <Logo />
        </div>

        <div className="slds-global-header__item header-tabs">
          <NavigationTabs />
        </div>

        {/* 右侧区域：UtilityMenu 控制部分 */}
        <div className="slds-global-header__item header-actions">
          {permissions?.UtilityMenu?.UtilityMenu_Help ? <Help /> : null}
          {permissions?.UtilityMenu?.UtilityMenu_Settings ? <Settings /> : null}
          {permissions?.UtilityMenu?.UtilityMenu_Notifications ? <Notifications /> : null}
          {permissions?.UtilityMenu?.UtilityMenu_UserMenu ? <UserMenu /> : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
