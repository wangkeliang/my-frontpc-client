// src/utils/validators.js
import { publicApi } from '../services/ApiService';

/**
 * 验证邮箱格式的共通函数
 * @param {string} email - 用户输入的邮箱
 * @returns {string} - 返回错误消息，若无错误则返回空字符串
 */
export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        return '邮箱不能为空';
    }
    if (!emailPattern.test(email)) {
        return '请输入有效的邮箱格式';
    }
    if (email.length > 40) {
        return '邮箱长度不能超过40个字符';
    }
    return ''; // 无错误时返回空字符串
}

/**
 * 检查邮箱是否为免费邮箱
 * @param {string} email - 用户输入的邮箱
 * @returns {Promise<boolean>} - 如果是免费邮箱返回 true，企业邮箱返回 false
 */
export async function checkCorporateEmail(email) {
    try {
        const response = await publicApi.post('/api/system/check-email', { email });
        
        // 检查是否返回 FREE_EMAIL_ERROR，如果是，则是免费邮箱
        if (response.data.status !== 'success' && response.data.error[0].code === 'FREE_EMAIL_ERROR') {
            return true; // 免费邮箱
        }
        return false; // 企业邮箱
    } catch (error) {
        console.error('邮箱检查出错:', error);
        return false; // 发生错误时，默认为企业邮箱
    }
}

