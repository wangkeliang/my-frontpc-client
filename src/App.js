// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import { useDispatch, useSelector } from 'react-redux';

import RegisterPage from './pages/RegisterPage/RegisterPage'; // 导入注册页面组件
import ConfirmationPendingPage from './pages/ConfirmationPendingPage/ConfirmationPendingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import EmailVerificationPage from './pages/EmailVerificationPage/EmailVerificationPage';
import { startHeartbeat, logoutUser } from './redux/auth/authSlice';
import SystemErrorPage from './pages/SystemErrorPage/SystemErrorPage'; 
const INACTIVITY_TIMEOUT = parseInt(process.env.REACT_APP_INACTIVITY_TIMEOUT_MS) || 300000;

function InactivityHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { token, deviceId, user } = useSelector((state) => state.auth);

  useEffect(() => {
    let inactivityTimer;
    console.log('**process.env.REACT_APP_HEARTBEAT_INTERVAL_MS=',process.env.REACT_APP_HEARTBEAT_INTERVAL_MS);

    if (token && deviceId) {
      const interval = setInterval(() => {
        console.log('**begin startHeartbeat');
        dispatch(startHeartbeat());
      }, parseInt(process.env.REACT_APP_HEARTBEAT_INTERVAL_MS) || 5000);

      const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          dispatch(logoutUser());
        }, INACTIVITY_TIMEOUT);
      };
      console.log('***INACTIVITY_TIMEOUT=',INACTIVITY_TIMEOUT);

      window.addEventListener('mousemove', resetInactivityTimer);
      window.addEventListener('keydown', resetInactivityTimer);

      resetInactivityTimer();

      return () => {
        clearInterval(interval);
        clearTimeout(inactivityTimer);
        window.removeEventListener('mousemove', resetInactivityTimer);
        window.removeEventListener('keydown', resetInactivityTimer);
      };
    }
  }, [token, deviceId, dispatch]);

  // 如果用户被登出，将导航到登录页面
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      {/* <InactivityHandler /> */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* 添加注册页面的路由 */}
        <Route path="/confirmation-pending" element={<ConfirmationPendingPage />} />
        <Route path="/emailVerification"  element={<EmailVerificationPage />}/>
        <Route path="/error"  element={<SystemErrorPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
