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
import { logoutUser } from './redux/auth/authSlice';
import SystemErrorPage from './pages/SystemErrorPage/SystemErrorPage'; 
import WebSocketClient from './services/WebSocketClient';
import { useErrorBoundary } from "react-error-boundary";

const INACTIVITY_TIMEOUT = parseInt(process.env.REACT_APP_INACTIVITY_TIMEOUT_MS) || 300000;


function App() {
  const userId = useSelector((state) => state.auth.userId);
  const deviceId = useSelector((state) => state.auth.deviceId);
  const { showBoundary  } = useErrorBoundary();
  console.log('***app loaded')
  console.log('***userId=',userId);
  useEffect(() => {
    // 当 userId 和 deviceId 存在时初始化 WebSocket
    if (userId && deviceId && WebSocketClient.socket?.readyState !== WebSocket.OPEN) {
      console.log('正在初始化 WebSocket 连接...');
      // alert("App: " +"userId: "+ userId );
         WebSocketClient.connect(showBoundary);      
    }
  }, [userId, deviceId]);



  return (    
      <Router>     
        <Routes>        

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main/*" element={<MainPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* 添加注册页面的路由 */}
          <Route path="/confirmation-pending" element={<ConfirmationPendingPage />} />
          <Route path="/emailVerification"  element={<EmailVerificationPage />}/>
          <Route path="/error"  element={<SystemErrorPage />}/>
        </Routes>
      </Router>
  );
}

export default App;
