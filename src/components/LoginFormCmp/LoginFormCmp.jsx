import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginUser  
} from '../../redux/auth/authSlice';
import { validateEmailFormat } from '../../utils/Common'; // 引入通用的邮箱验证方法
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import './LoginFormCmp.css';
import { LocalError } from '../../utils/LocalError'; // 引入 LocalError 类
import { GlobalPopupError } from '../../utils/GlobalPopupError'; // 引入 GlobalPopupError 类
import { setPopupError } from '../../redux/popupError/popupError';
import { useErrorBoundary } from "react-error-boundary";



function LoginFormCmp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  const { loading } = useSelector((state) => state.auth); // 获取 loading 状态
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showBoundary  } = useErrorBoundary();

  useEffect(() => {
    // 初始化登录表单
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    const rememberMe = !!(savedEmail && savedPassword);

    if (rememberMe) {
    setEmail(savedEmail);
    setPassword(savedPassword);
    setRememberMe(rememberMe);
    }
    // 清空登录状态
    dispatch({ type: 'root/clearAllStates' });    
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null); // 清空本地错误

    // 验证用户输入
    if (!email && !password) {
      setLocalError(new LocalError({ errorMessage: 'メールアドレスとパスワードは必須です。' }));
      return;
    }
    if (!email) {
      setLocalError(new LocalError({ errorMessage: 'メールアドレスは必須です。' }));
      return;
    }
    if (!password) {
      setLocalError(new LocalError({ errorMessage: 'パスワードは必須です。' }));
      return;
    }

    const { isValid, message } = validateEmailFormat(email);
    if (!isValid) {
      setLocalError(new LocalError({ errorMessage: message }));
      return;
    }

    try {
        // 保存登录信息
        if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        }
        console.log('**before dispatch');
        await dispatch(loginUser({ email, password})).unwrap();
        console.log('**after dispatch');

    } catch (error) {
    //    // 捕获本地或全局错误
      if (error instanceof LocalError) {
        setLocalError(error); // 显示在本地页面
      } else if (error instanceof GlobalPopupError) {
        console.log('****error instanceof GlobalPopupError',error);
        dispatch( setPopupError(error));
        // showBoundary (error); // 抛到错误边界
      } else {
        console.log('****else',error);
        dispatch( setPopupError(new GlobalPopupError({ error,errorMessage: '未知エラーが発生しました。' })))
        // showBoundary (new GlobalPopupError({ error,errorMessage: '未知エラーが発生しました。' }));
      }

    }
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div className="slds-box slds-theme_default slds-p-around_large slds-m-around_medium slds-size_1-of-1">
      <form
        className="slds-form slds-form_stacked"
        onSubmit={handleLogin}
      >
        {localError && (
          <div className="error-message slds-text-color_error">
            {localError.errorMessage}
          </div>
        )}

        <div className="slds-form-element slds-m-bottom_large">
          <label className="slds-form-element__label" htmlFor="email">
            メールアドレス
          </label>
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
          <label className="slds-form-element__label" htmlFor="password">
            パスワード
          </label>
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
          <a href="/forgot-password" className="slds-text-link">
            パスワードをお忘れですか?
          </a>
          <span className="link-spacing">|</span>
          <a
            onClick={handleSignUpClick}
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