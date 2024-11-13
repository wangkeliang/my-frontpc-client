// src/components/LoginSection/LoginSection.jsx
import React from 'react';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import './LoginSection.css';

function LoginSection() {
  return (
    <div className="login-section">
      <span>すでにアカウントをお持ちの方</span>
      <div>
        <a href="/login" className="login-button">ログインページへ</a>
      </div>
    </div>
  );
}

export default LoginSection;
