import React from 'react';
import './LoginFooterCmp.css';

function FooterCmp() {
  return (
    <div className="loginfooter">
      <p>&copy; 2025 Star Sky株式会社. All rights reserved.</p>
      <div className="loginfooter-links">
        <a href="/privacy-policy">プライバシーポリシー</a>
        <a href="/terms-of-service">利用規約</a>
        <a href="/contact">お問い合わせ</a>
      </div>
    </div>
  );
}

export default FooterCmp;
