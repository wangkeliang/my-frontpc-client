// src/services/LoginFormCmpService.js

import { loginUser, clearError } from '../redux/auth/authSlice';
import { validateEmailFormat } from '../utils/Common'; // 引入通用的邮箱验证方法
import { fetchUserPermissions } from '../redux/permission/permissionSlice'; // Import fetchUserPermissions
import WebSocketClient from './webSocketClient'; // 导入 WebSocketClient

export function initLoginForm(setEmail, setPassword, setRememberMe) {
    const { savedEmail, savedPassword, rememberMe } = loadSavedCredentials();
    if (rememberMe) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(rememberMe);
    }
  }

export function handleSignUpClick(navigate) {
    navigate('/register');
}

/**
 * Form submission handler
 * @param {Event} e - The form submit event
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember me flag
 * @param {Function} setLocalError - Function to set local error message
 */
export function onSubmitForm(e,dispatch,email, password, rememberMe, setLocalError) {
    e.preventDefault();
    handleLogin(dispatch, email, password, setLocalError); // Use existing login handler
    saveCredentials(email, password, rememberMe); // Save or delete credentials
}

/**
 * 加载已保存的用户凭据
 * - 从本地存储中加载电子邮件和密码，并确定 "记住我" 状态
 * @returns {Object} 包含已保存的电子邮件、密码和 "记住我" 状态的对象
 */
export function loadSavedCredentials() {
  const savedEmail = localStorage.getItem('email'); // 从本地存储中获取电子邮件
  const savedPassword = localStorage.getItem('password'); // 从本地存储中获取密码
  const rememberMe = !!(savedEmail && savedPassword); // 如果电子邮件和密码都存在，则 "记住我" 为 true
  return { savedEmail, savedPassword, rememberMe }; // 返回凭据和状态
}

/**
 * 保存或删除用户凭据
 * - 根据 "记住我" 状态决定是保存还是删除电子邮件和密码
 * @param {string} email - 用户的电子邮件
 * @param {string} password - 用户的密码
 * @param {boolean} rememberMe - 是否选择了 "记住我"
 */
export function saveCredentials(email, password, rememberMe) {
  if (rememberMe) {
    localStorage.setItem('email', email); // 保存电子邮件
    localStorage.setItem('password', password); // 保存密码
  } else {
    localStorage.removeItem('email'); // 删除电子邮件
    localStorage.removeItem('password'); // 删除密码
  }
}

/**
 * 处理用户登录
 * - 验证电子邮件和密码的输入，清除错误信息并发送登录请求
 * @param {Function} dispatch - Redux 的 dispatch 方法
 * @param {string} email - 用户的电子邮件
 * @param {string} password - 用户的密码
 * @param {Function} setLocalError - 设置本地错误消息的方法
 */
export function handleLogin(dispatch, email, password, setLocalError) {
  // 清除错误消息
  setLocalError('');
  dispatch(clearError()); // 清除 Redux 中的错误

  // 验证输入并显示错误消息
  if (!email && !password) {
    setLocalError("メールアドレスとパスワードは必須です。");
    return;
  }
  if (!email) {
    setLocalError("メールアドレスは必須です。");
    return;
  }
  if (!password) {
    setLocalError("パスワードは必須です。");
    return;
  }

  // 验证电子邮件格式
  const { isValid, message } = validateEmailFormat(email);
  if (!isValid) {
    setLocalError(message); // 如果格式无效，设置错误消息
    return;
  }

  dispatch(loginUser({ email, password }))
  .unwrap() // 使用 unwrap() 来处理异步操作的结果
  .then((actionPayload) => {
    // 登录成功后调用 fetchUserPermissions
    const { userId } = actionPayload;
    console.log('userId=',userId);
    dispatch(fetchUserPermissions(userId));
    // // 在此处调用 WebSocketClient 的 connect 方法
    // console.log('****webSocketClient is called');
    const webSocketClient = new WebSocketClient();
    webSocketClient.connect();
  })
  .catch((error) => {
    // 处理登录失败的情况
    setLocalError(error);
  });
 
}
