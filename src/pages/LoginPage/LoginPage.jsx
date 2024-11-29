// src/pages/LoginPage/LoginPage.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginPanelCmp from '../../components/LoginPanelCmp/LoginPanelCmp';
import PromoPanelCmp from '../../components/PromoPanelCmp/PromoPanelCmp';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { userId,webSocketSuccess } = useSelector((state) => state.auth);
  const { permissionSuccess } = useSelector((state) => state.permissions);

  useEffect(() => {
    // 当 user 存在时表示登录成功，跳转到 MainPage
    console.log('***userId=',userId);
    console.log('***webSocketSuccess=',webSocketSuccess);
    console.log('***permissionSuccess=',permissionSuccess);
    if (userId && webSocketSuccess && permissionSuccess) {
      navigate('/main');
    }
  }, [userId,webSocketSuccess,permissionSuccess, navigate]);

  return (
    <div className="login-page slds-grid slds-wrap">
      <div className="login-panel-container slds-size_1-of-2 slds-p-around_medium">
        <LoginPanelCmp />
      </div>
      <div className="promo-panel-container slds-size_1-of-2 slds-p-around_medium">
        <PromoPanelCmp />
      </div>
    </div>
  );
}

export default LoginPage;
