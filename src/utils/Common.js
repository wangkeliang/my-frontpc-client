// src/utils/Common.js
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
/**
 * 验证电子邮件格式
 * - 使用正则表达式验证电子邮件的格式是否有效
 * - 确保电子邮件输入不能为空且长度不能超过 40 个字符
 * @param {string} email - 用户的电子邮件
 * @returns {Object} 包含验证结果和错误消息的对象
 */
export function validateEmailFormat(email) {
    if (!email) {
      return { isValid: false, message: "メールアドレスを入力してください。" }; // 邮箱不能为空
    }
    if (email.length > 40) {
      return { isValid: false, message: "メールアドレスは40文字以内で入力してください。" }; // 邮箱长度不能超过40个字符
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "無効なメールアドレス形式です。" }; // 邮箱格式无效
    }
    return { isValid: true, message: "" }; // 验证成功
  }
  
/**
 * 获取设备 ID
 * - 从本地存储中获取设备 ID，如果没有，则生成一个新的设备 ID 并存储到本地存储中
 * @returns {string} 设备 ID
 */
export function getDeviceId() {
    if (typeof localStorage === 'undefined') {
      return uuidv4(); // 如果 localStorage 不可用，则直接生成并返回 UUID
    }
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }
 