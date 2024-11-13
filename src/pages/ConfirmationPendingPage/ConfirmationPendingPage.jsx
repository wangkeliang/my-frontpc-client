// src/components/ConfirmationPendingPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleResendEmail } from '../../services/ConfirmationPendingPageService'; // 导入服务方法
import './ConfirmationPendingPage.css';

const ConfirmationPendingPage = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const { status, email } = useSelector((state) => state.register); // 从 Redux 获取 email

  return (
    <div className="custom-confirmation-page">
      <div className="custom-confirmation-box slds-theme_default">
        <h2 className="custom-heading">ご登録ありがとうございます</h2>
        <div className="custom-content">
          <p>
            確認メールをお送りしておりますので、メールをご確認いただき、記載されているリンクをクリックしてアカウントを有効化してください。
          </p>
          <p>
            確認メールが届かない場合は、迷惑メールフォルダをご確認いただくか、以下のボタンをクリックして再送信をリクエストしてください。
          </p>
        </div>
        <div className="custom-button-container">
          <button
            onClick={() => handleResendEmail(dispatch, email, setMessage)} // 直接调用服务方法
            className="slds-button slds-button_brand custom-button"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? '送信中...' : '確認メールを再送信する'}
          </button>
        </div>
        {message && <p className="slds-text-color_success custom-success-text">{message}</p>}
      </div>
    </div>
  );
};

export default ConfirmationPendingPage;
