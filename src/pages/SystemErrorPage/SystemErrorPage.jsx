import React from 'react';
import './SystemErrorPage.css';
import { FaExclamationTriangle } from 'react-icons/fa'; // 确保 react-icons 库已安装

const SystemErrorPage = () => {
  return (
    <div className="system-error-page">
      <div className="system-error-container">
        <h1 className="system-error-header">
          <FaExclamationTriangle className="error-icon" /> {/* 错误图标 */}
          システムエラー
        </h1>
        <p className="system-error-message">
          申し訳ございませんが、システムに問題が発生しました。しばらくしてから再度お試しください。
        </p>
        <p className="system-error-message-left">
          お急ぎの場合は、技術サポートチームまでお問い合わせください。
        </p>
        <p className="contact-info">
          連絡先：<a href="mailto:support@starsky.co.jp" className="system-error-link">support@starsky.co.jp</a>
        </p>
      </div>
    </div>
  );
};

export default SystemErrorPage;
