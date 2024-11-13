// src/components/Header/Header.jsx
import React from 'react';
import Logo from '../Logo/Logo';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import Help from '../Help/Help';
import Notifications from '../Notifications/Notifications';
import Settings from '../Settings/Settings';
import UserMenu from '../UserMenu/UserMenu';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import './Header.css';

const Header = () => {
  return (
    <header >
      <div className="slds-global-header slds-grid slds-grid_align-spread">
        {/* 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
        {/* 左侧区域：Logo 和 NavigationTabs */}
        <div className="slds-global-header__item">
          <Logo />
        </div>

        <div className="slds-global-header__item header-tabs">
          <NavigationTabs />
        </div>

        {/* 右侧区域：UtilityMenu, Help, Notifications, Settings, UserMenu */}
        <div className="slds-global-header__item header-actions">
          <Help />
          <Settings />
          <Notifications />          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
