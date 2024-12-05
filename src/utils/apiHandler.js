import WebSocketClient from '../services/WebSocketClient';
import { loginUser } from '../redux/auth/authSlice';
import store from '../redux/store'; // 引入 Redux store
import { authApi } from '../services/ApiService';
import { ResponseErrorHandler } from './ResponseErrorHandler';
import ErrorMap from './ErrorMap';
import { checkToken } from './TokenChecker';
import { LocalError } from './LocalError'; // 引入 LocalError 类
import { GlobalPopupError } from './GlobalPopupError'; // 引入 GlobalPopupError 类
import { checkNetworkStatus } from './Common';

export const apiHandler = async (apiInstance, url, data, method = 'POST', onSuccess, onLocalError,onGlobalError) => {
  try {
    console.log('****apiHandler is begin');

    const state = store.getState();
    const { token, deviceId } = state.auth;
    console.log('***url=',url);

    // 检查 token 是否存在
    if (apiInstance==authApi){
      if (!checkToken(onGlobalError)) {
        return; // 如果 Token 检查失败，直接退出
      }
      // 确保 WebSocket 已连接
      await WebSocketClient.ensureConnected(onGlobalError); 
    }

    let response;
    // 根据 method 参数选择请求方法
    if (method === 'GET') {
      response = await apiInstance.get(url, { params: data }); // GET 请求，数据通过 params 传递
    } else if (method === 'POST') {
      response = await apiInstance.post(url, data); // POST 请求，数据通过 body 传递
    } else if (method === 'PUT') {
      response = await apiInstance.put(url, data); // PUT 请求
    } else if (method === 'DELETE') {
      response = await apiInstance.delete(url, { data }); // DELETE 请求
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
 
    if (response?.data?.status === 'success') {
      // 成功响应
      onSuccess(response.data.data);
    } 
   
  } catch (error) { 
    // 初始化错误配置
    

    // 优先处理网络错误
    // if (!checkNetworkStatus.isConnected) {
    //   console.log('***window.navigator.offLine');
    //   errorConfig = ErrorMap.getError('NETWORK_DISCONNECTED');
    // } else {
    //   console.log('***window.navigator.onLine');
    //   // 获取特定的错误码对应的错误配置
    //   errorConfig = ErrorMap.getError(error?.code) || ErrorMap.getError('SYSTEM_ERROR');
    // }
    if (error?.response?.data?.error?.[0]?.errorCode){
      ResponseErrorHandler(error?.response,onLocalError, onGlobalError);
      
    }else{
      let errorConfig;
      errorConfig = ErrorMap.getError(error?.code) || ErrorMap.getError('SYSTEM_ERROR');
      // 创建全局错误对象
      const e = new GlobalPopupError({
        error: error, // 保留原始错误信息
        ...errorConfig, // 包括错误消息和展示类型
      });

      // 调用全局错误处理回调
      onGlobalError(e);
    }
    

    


  }
};
