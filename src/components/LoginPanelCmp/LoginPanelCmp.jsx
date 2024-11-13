import React from 'react';
import LoginCmp from '../LoginCmp/LoginCmp';
import LoginFooterCmp from '../LoginFooterCmp/LoginFooterCmp';
import './LoginPanelCmp.css';

function LoginPanelCmp() {
  return (
    <div className="login-panel ">
      <div className="login-logo-container">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="loginlogo" />
      </div>
      <div className="login-container">
        <LoginCmp />
      </div>
      <LoginFooterCmp />
    </div>
  );
}

export default LoginPanelCmp;
