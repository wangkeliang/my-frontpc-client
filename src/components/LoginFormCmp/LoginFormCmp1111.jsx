import React, { useState, useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  initLoginForm,
  handleSignUpClick,
  onSubmitForm,
} from '../../services/LoginFormCmpService';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import './LoginFormCmp.css';

function LoginFormCmp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  // Initialize form with saved credentials
  useEffect(() => {
    initLoginForm(setEmail, setPassword, setRememberMe);
  }, []); // 添加 dispatch 到依赖数组

  return (
    <div className="slds-box slds-theme_default slds-p-around_large slds-m-around_medium slds-size_1-of-1">
      <form
        className="slds-form slds-form_stacked"
        onSubmit={(e) => onSubmitForm(e, dispatch, email, password, rememberMe, setLocalError)}
      >
        {(localError || error) && (
          <div className="error-message slds-text-color_error">
            {localError || error}
          </div>
        )}

        <div className="slds-form-element slds-m-bottom_large">
          <label className="slds-form-element__label" htmlFor="email">メールアドレス</label>
          <div className="slds-form-element__control">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="slds-input custom-input-height"
            />
          </div>
        </div>

        <div className="slds-form-element slds-m-bottom_large">
          <label className="slds-form-element__label" htmlFor="password">パスワード</label>
          <div className="slds-form-element__control">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="slds-input custom-input-height"
            />
          </div>
        </div>

        <button
          type="submit"
          className="slds-button slds-button_brand slds-button_stretch slds-m-bottom_large custom-input-height button-spacing"
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>

        <div className="slds-form-element slds-checkbox slds-m-bottom_large">
          <label className="slds-checkbox__label" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="slds-checkbox_faux"></span>
            <span className="slds-form-element__label">ログイン情報を保存する</span>
          </label>
        </div>

        <div className="slds-m-top_medium slds-m-bottom_large align-left">
          <a href="/forgot-password" className="slds-text-link">パスワードをお忘れですか?</a>
          <span className="link-spacing">|</span>
          <a
            onClick={() => handleSignUpClick(navigate)}
            className="slds-text-link"
            style={{ cursor: 'pointer' }}
          >
            サインアップ
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginFormCmp;
