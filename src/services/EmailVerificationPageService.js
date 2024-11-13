// src/services/EmailVerificationPageService.js
import { publicApi } from './ApiService';

/**
 * 初始化方法，用于在组件加载时验证电子邮件
 * @param {Object} calledRef - 用于确保只调用一次的引用对象
 * @param {string} email - 用户的电子邮件
 * @param {string} token - 验证令牌
 * @param {Function} setMessage - 设置消息的方法
 * @param {Function} setSuccess - 设置验证状态的方法
 */
export function initEmailVerification(calledRef, email, token, setMessage, setSuccess) {
  if (calledRef.current) return;
  calledRef.current = true;
  verifyEmailService(email, token, setMessage, setSuccess); // 调用验证服务
}

/**
 * 验证电子邮件
 * @param {string} email - 用户的电子邮件
 * @param {string} token - 验证令牌
 * @param {Function} setMessage - 设置消息的方法
 * @param {Function} setSuccess - 设置验证状态的方法
 */
export async function verifyEmailService(email, token, setMessage, setSuccess) {
  try {
    console.log('users/verify-email is called');
    const response = await publicApi.post('/auth/verify-email', { email, token });
    const { status, message,error, data } = response.data;

    if (status === 'success') {
      setMessage(message);
      setSuccess(true);
    } else {
      setMessage(error?.[0]?.errorMessage || 'メール認証に失敗しました。');
      setSuccess(false);
    }
  } catch (error) {
    if (error?.response?.data?.error) {
        setMessage(error.response.data.error[0].errorMessage);
    }else{
        setMessage('システムエラーが発生しました。しばらくしてからもう一度お試しください。');
    }
    
    setSuccess(false);
  }
}

/**
 * 重新发送确认邮件
 * @param {string} email - 用户的电子邮件
 * @param {Function} setResendMessage - 设置重新发送消息的方法
 * @param {Function} setLoading - 设置加载状态的方法
 */
export async function resendEmailService(email, setResendMessage, setLoading) {
  setLoading(true);
  setResendMessage('');
  try {
    const response = await publicApi.post('/auth/resend-confirmation-email', { email });
    const { status, error } = response.data;

    if (status === 'success') {
      setResendMessage('確認メールを再送信しました。メールをご確認ください。');
    } else {
      setResendMessage(error?.[0]?.errorMessage || 'メールの再送信に失敗しました。');
    }
  } catch (error) {
    if (error?.response?.data?.error) {
        setResendMessage(error.response.data.error[0].errorMessage);
    }else{
        setResendMessage('システムエラーが発生しました。しばらくしてからもう一度お試しください。');
    }
  } finally {
    setLoading(false);
  }
}
