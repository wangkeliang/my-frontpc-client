// src/components/Header/UserMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/auth/authSlice'; // 调用 logoutUser action
import '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';
import './UserMenu.css';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login'); // 登出成功后导航到登录页面
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const user = {
    name: '田中 太郎',
    initials: 'TT',
    avatarUrl: '/assets/avatar.png',
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-button" title="User Menu" onClick={toggleMenu}>
        <img src={`${process.env.PUBLIC_URL}/loginIcon.png`} alt="User Avatar" className="user-avatar" />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <img src={`${process.env.PUBLIC_URL}/loginIcon.png`} alt="User Avatar" className="user-avatar-large" />
            <span className="user-name">{user.name}</span>
            <button className="close-button" onClick={handleCloseMenu}>×</button>
          </div>
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
