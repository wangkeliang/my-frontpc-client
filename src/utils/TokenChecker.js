// src/utils/TokenChecker.js

import store from '../redux/store';
import { loginUser } from '../redux/auth/authSlice';
import ErrorMap from './ErrorMap';

/**
 * Token 検査ユーティリティ
 * @param {Function} onGlobalError - グローバルエラーを処理するコールバック関数
 */
export const checkToken = (onGlobalError) => {
  const state = store.getState();
  const { token } = state.auth;

  if (!token) {
    console.warn('Token 不存在，跳转到登录页面');
    store.dispatch(loginUser()); // 触发登录动作

    const errorConfig = ErrorMap.get('SESSION_EXPIRED'); // 从 ErrorMap 获取详细信息
    onGlobalError({
      error: new Error(errorConfig.errorMessage),
      ...errorConfig,
    });

    return false; // 表示 Token 检查失败
  }

  return true; // 表示 Token 检查通过
};
