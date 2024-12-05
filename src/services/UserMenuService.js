// src/services/UserMenuService.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/auth/authSlice'; // 引入 logoutUser action
import { useRef, useEffect, useState } from 'react';
import WebSocketClient from './WebSocketClient';
import { useErrorBoundary } from "react-error-boundary";
// Hook to manage user menu logic
export function useUserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { showBoundary  } = useErrorBoundary();

  // 用户信息
  const user = {
    name: '田中 太郎',
    initials: 'TT',
    avatarUrl: '/assets/avatar.png',
  };

  // Toggle the visibility of the menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the menu
  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  // Handle user logout
  const handleLogout = () => {

    console.log('handleLogout is begin');
    dispatch(logoutUser({ showBoundary  })).unwrap();
  };

  // Close the menu when clicking outside of it
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
  }, [menuRef]);

  return { isOpen, menuRef, toggleMenu, handleCloseMenu, handleLogout, user };
}
