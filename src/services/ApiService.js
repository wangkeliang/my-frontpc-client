// src/services/ApiService.js
import axios from 'axios';
import { logoutUser } from '../redux/auth/authSlice';
import store from '../redux/store'; // 导入 Redux store

// 获取用户时区，如果无法获取则默认为东京时区
const getTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo';
  } catch (error) {
    console.warn('无法获取用户时区，默认设置为东京时区 (Asia/Tokyo)', error);
    return 'Asia/Tokyo';
  }
};


// 带有拦截器的实例（用于需要认证的请求）
const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


// 请求拦截器：添加 Authorization 头和 deviceId
authApi.interceptors.request.use(
  async (config) => {
    const state = store.getState(); // 从 Redux store 获取状态
    const { token, deviceId } = state.auth; // 从 auth 状态中获取 token 和 deviceId

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (deviceId) {
      config.headers['Device-Id'] = deviceId;
    }

    // 添加时区信息
    config.headers['User-TimeZone'] = getTimeZone();
    return config;
  },
  (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // 检查是否返回自定义的错误结构
    const responseData = error.response?.data;
    console.log('authApi.interceptors.response:',responseData);
    
    if (
      responseData?.status === "fail" &&
      responseData?.error?.some(
        (err) => err.errorCode === "INVALID_TOKEN" || err.errorCode === "AUTH_HEADER_MISSING"
      )
    ) {
    // 如果响应符合条件，调用 logoutUser action
    store.dispatch(logoutUser());
    }

    return Promise.reject(error);
  } // 此处添加右括号，结束拦截器函数
);

// 不带拦截器的实例（用于不需要认证的请求）
const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 请求拦截器：添加 User-TimeZone
publicApi.interceptors.request.use(
  (config) => {
    // 添加时区信息
    config.headers['user-timezone'] = getTimeZone();
    return config;
  },
  (error) => Promise.reject(error)
);

export { authApi, publicApi };
