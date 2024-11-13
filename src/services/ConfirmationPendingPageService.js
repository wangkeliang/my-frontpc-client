// src/services/ConfirmationPendingPageService.js
import { resendConfirmationEmail } from '../redux/auth/registerSlice';

/**
 * 处理确认邮件的重发请求
 * @param {Function} dispatch - Redux 的 dispatch 方法
 * @param {string} email - 用户的电子邮件
 * @param {Function} setMessage - 设置消息的函数
 */
export async function handleResendEmail(dispatch, email, setMessage) {
  setMessage(''); // 清空消息
  try {
    await dispatch(resendConfirmationEmail(email)).unwrap(); // 传入 email
    setMessage('確認メールを再送信しました。メールをご確認ください。');
  } catch (error) {
    setMessage('メールの再送信に失敗しました。しばらくしてからもう一度お試しください。');
  }
}
