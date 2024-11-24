// src/utils/apiHandler.js
export const apiHandler = async (apiInstance, url, data, onSuccess, onFailure, onError) => {
    try {
      const response = await apiInstance.post(url, data);
  
      if (response.data.status === 'success') {
        // 成功时调用成功回调函数
        onSuccess(response.data.data);
      } else {
        // 失败时调用失败回调函数
        const error = response.data.error[0];
        const errorCode = error?.errorCode || null;
        const errorMessage = error?.errorMessage || '操作失败';
        onFailure({ errorCode, errorMessage });
      }
    } catch (error) {
      // 异常时调用错误回调函数
      if (error?.response?.data?.error) {
        const apiError = error.response.data.error[0];
        const errorCode = apiError?.errorCode || null;
        const errorMessage = apiError?.errorMessage || '操作失败';
        onError({ errorCode, errorMessage });
      } else {
        onError({ errorCode: null, errorMessage: error.response?.data?.message || '操作失败' });
      }
    }
  };
  