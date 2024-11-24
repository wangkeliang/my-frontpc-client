// src/components/Header/UserMenu.jsx
import React from 'react';
import { useUserMenu } from '../../services/UserMenuService'; // 使用抽离的逻辑
import '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';
import './UserMenu.css';

const UserMenu = () => {
  const { isOpen, menuRef, toggleMenu, handleCloseMenu, handleLogout, user } = useUserMenu(); // 获取 UserMenu 逻辑和用户数据

  return (
    <div className="user-menu" ref={menuRef}>
      {/* User Menu Button */}
      <button className="user-menu-button" title="User Menu" onClick={toggleMenu}>
        <img src={`${process.env.PUBLIC_URL}/loginIcon.png`} alt="User Avatar" className="user-avatar" />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          {/* User Menu Header */}
          <div className="user-menu-header">
            <img src={`${process.env.PUBLIC_URL}/loginIcon.png`} alt="User Avatar" className="user-avatar-large" />
            <span className="user-name">{user.name}</span>
            <button className="close-button" onClick={handleCloseMenu}>×</button>
          </div>

          {/* User Menu List */}
          <ul className="user-menu-list">
            <li className="user-menu-item">
              <svg className="user-menu-icon" aria-hidden="true">
                <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#user"></use>
              </svg>
              私の個人情報
            </li>
            <li className="user-menu-item">
              <svg className="user-menu-icon" aria-hidden="true">
                <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#identity"></use>
              </svg>
              アカウント管理
            </li>
            <li className="user-menu-item">
              <svg className="user-menu-icon" aria-hidden="true">
                <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
              </svg>
              個人設定
            </li>
            <hr className="menu-divider" />
            <li className="user-menu-item logout" onClick={handleLogout}>
              <svg className="user-menu-icon" aria-hidden="true">
                <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#logout"></use>
              </svg>
              ログアウト
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
