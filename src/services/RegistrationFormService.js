// src/services/RegistrationFormService.js
import { validateEmail } from '../utils/validators';
import { registerUser, setFormError } from '../redux/auth/registerSlice';

/**
 * 处理电子邮件输入更改
 * @param {Event} e - 输入事件
 * @param {Function} setEmailError - 设置电子邮件错误的方法
 * @param {Function} setFormData - 设置表单数据的方法
 */
export function handleEmailChange(e, setEmailError, setFormData) {
  const email = e.target.value;
  setEmailError(validateEmail(email));
  setFormData((prevData) => ({ ...prevData, email }));
}

/**
 * 处理密码输入更改
 * @param {Event} e - 输入事件
 * @param {Function} setFormData - 设置表单数据的方法
 * @param {Function} setPasswordStrength - 设置密码强度的方法
 */
export function handlePasswordChange(e, setFormData, setPasswordStrength) {
  const password = e.target.value;
  setFormData((prevData) => ({ ...prevData, password }));

  if (password.length < 8) {
    setPasswordStrength('弱い');
  } else if (password.length < 12) {
    setPasswordStrength('中');
  } else {
    setPasswordStrength('強い');
  }
}

/**
 * 处理确认密码输入更改
 * @param {Event} e - 输入事件
 * @param {Function} setPasswordMatch - 设置密码匹配状态的方法
 * @param {Function} setFormData - 设置表单数据的方法
 * @param {string} password - 当前密码
 */
export function handleConfirmPasswordChange(e, setPasswordMatch, setFormData, password) {
  const confirmPassword = e.target.value;
  setPasswordMatch(confirmPassword === password);
  setFormData((prevData) => ({ ...prevData, confirmPassword }));
}

/**
 * 获取密码强度颜色
 * @param {string} passwordStrength - 密码强度
 * @returns {string} 颜色值
 */
export function getPasswordStrengthColor(passwordStrength) {
  switch (passwordStrength) {
    case '弱い':
      return 'red';
    case '中':
      return 'orange';
    case '強い':
      return 'green';
    default:
      return 'black';
  }
}

/**
 * 处理表单提交
 * @param {Event} e - 提交事件
 * @param {Object} formData - 表单数据
 * @param {Function} dispatch - Redux 的 dispatch 方法
 * @param {Function} navigate - 路由导航方法
 * @param {Function} setFormError - 设置表单错误的方法
 * @param {string} emailError - 电子邮件错误
 * @param {boolean} agreeTerms - 是否同意条款
 * @param {boolean} passwordMatch - 密码是否匹配
 * @param {string} passwordStrength - 密码强度
 */
export async function handleSubmit(
  e,
  formData,
  dispatch,
  navigate,
  setFormError,
  emailError,
  agreeTerms,
  passwordMatch,
  passwordStrength
) {
  e.preventDefault();
  dispatch(setFormError(''));

  if (!formData.email || !formData.password || !formData.confirmPassword) {
    dispatch(setFormError('すべての必須項目を入力してください'));
    return;
  }

  if (!agreeTerms) {
    dispatch(setFormError('利用規約に同意してください'));
    return;
  }

  if (emailError || !passwordMatch || passwordStrength === '弱い') {
    dispatch(setFormError('入力内容に誤りがあります。再確認してください。'));
    return;
  }

  const result = await dispatch(registerUser(formData));
  if (registerUser.fulfilled.match(result)) {
    navigate('/confirmation-pending');
  } else if (registerUser.rejected.match(result)) {
    dispatch(setFormError(result.payload));
  }
}
