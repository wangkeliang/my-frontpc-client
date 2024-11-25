export const apiHandler = async (apiInstance, url, data, method = 'POST', onSuccess, onFailure, onError) => {
  try {
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

    // 成功响应
    if (response.data.status === 'success') {
      onSuccess(response.data.data);
    } else {
      // 失败响应
      const error = response.data.error[0];
      const errorCode = error?.errorCode || null;
      const errorMessage = error?.errorMessage || '操作失敗';
      onFailure({ errorCode, errorMessage });
    }
  } catch (error) {
    // 异常处理
    if (error?.response?.data?.error) {
      const apiError = error.response.data.error[0];
      const errorCode = apiError?.errorCode || null;
      const errorMessage = apiError?.errorMessage || 'システム異常';
      onError({ errorCode, errorMessage });
    } else {
      onError({ errorCode: null, errorMessage: error.response?.data?.message || 'システム異常' });
    }
  }
};
