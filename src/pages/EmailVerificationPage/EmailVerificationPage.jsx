// src/components/EmailVerificationPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  initEmailVerification, // 导入初始化方法
  resendEmailService,
} from '../../services/EmailVerificationPageService';
import './EmailVerificationPage.css';

function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const calledRef = React.useRef(false);

  useEffect(() => {
    initEmailVerification(calledRef, email, token, setMessage, setSuccess); // 调用 init 方法
  }, [email, token]);

  return (
    <div className="email-verification-page">
      <div className="email-verification-box">
        <h2 className="email-verification-heading">メール認証</h2>
        <div className="email-verification-content">
          <p>{message || 'メール認証を進めています...'}</p>
          {success ? (
            <button className="email-verification-button" onClick={() => navigate('/login')}>
              ログイン
            </button>
          ) : (
            <>
              <div className="email-verification-button-container">
                <button
                  className="email-verification-button"
                  onClick={() => resendEmailService(email, setResendMessage, setLoading)}
                  disabled={loading}
                >
                  {loading ? '送信中...' : '確認メールを再送する'}
                </button>
              </div>
              {resendMessage && (
                <p className="email-verification-resend-message">{resendMessage}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
