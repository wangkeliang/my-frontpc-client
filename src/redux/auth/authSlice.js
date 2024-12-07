import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiHandler } from '../../utils/apiHandler'; // 引入通用的处理函数
import { publicApi, authApi } from '../../services/ApiService'; // 引入 API 实例
import { getDeviceId } from '../../utils/Common'; // 引用共通方法
import store from '../store'; // 引入 Redux store
// 异步登录操作
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password}, { rejectWithValue }) => {
    const deviceId = getDeviceId();
    const data = { email, password, deviceId };

    return new Promise((resolve, reject) => {
      apiHandler(
        publicApi,
        '/auth/login',
        data,
        'POST',
        // 成功回调
        (responseData) => {
          const { userId, email, token, deviceId,domain, companyId,apikey} = responseData;
          localStorage.setItem('userId', userId);
          localStorage.setItem('email', email);
          localStorage.setItem('token', token);
          localStorage.setItem('deviceId', deviceId);
          localStorage.setItem('domain', domain);
          localStorage.setItem('companyId', companyId);
          localStorage.setItem('apikey', apikey);          
          
          resolve({ token, deviceId, userId, email,domain,companyId,apikey });
        },
        // 回调错误信息显示到当前页面
        (localError) => {
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到错误边界
        (GlobalPopupError) => {    
          console.log('slice 错误回调，GlobalPopupError.errorMessage=',GlobalPopupError.errorMessage); 
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

// 异步登出操作
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => { // 第一个参数改为 `_` 表示未使用
    const { userId, deviceId } = getState().auth;
    console.log('★★getState().auth=',getState().auth);
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/auth/logout',
        { userId, deviceId },
        'POST',
        // 成功回调
        () => {
          console.log('***logout success');

          localStorage.removeItem('token');
          localStorage.removeItem('deviceId');
          localStorage.removeItem('companyId');
          localStorage.removeItem('apikey');  
          store.dispatch({ type: 'root/clearAllStates' });       
          window.location.href = '/login';          
          resolve(true);
        },
        // 回调错误信息显示到当前页面
        (localError) => {
          console.log('***localError=',localError);
          localStorage.removeItem('token');
          localStorage.removeItem('deviceId');
          localStorage.removeItem('companyId');
          localStorage.removeItem('apikey');
          store.dispatch({ type: 'root/clearAllStates' });
          window.location.href = '/login';
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到错误边界
        ( GlobalPopupError) => {
          console.log('***GlobalPopupError=',GlobalPopupError);
          localStorage.removeItem('token');
          localStorage.removeItem('deviceId');
          localStorage.removeItem('companyId');
          localStorage.removeItem('apikey');
          store.dispatch({ type: 'root/clearAllStates' });
          window.location.href = '/login';
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    email: null,
    token: null,
    deviceId: null,
    domain:null,
    companyId:null,
    apikey:null,    
    webSocketSuccess:false,
    loading: false,
    // error: null,
  },
  reducers: {
    // clearError: (state) => {
    //   state.error = null;
    // },
    setWebSocketSuccess: (state, action) => { // 新增 reducer
      state.webSocketSuccess = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        // state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.deviceId = action.payload.deviceId;
        state.domain = action.payload.domain;
        state.companyId = action.payload.companyId;
        state.apikey = action.payload.apikey;
        console.log('***state.domain =',action.payload);
        // state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('***loginUser.rejected');
        state.loading = false;
        // state.error = action.payload.errorMessage;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        // state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userId = null;
        state.email = null;
        state.token = null;
        state.deviceId = null;
        state.domain = null;
        state.companyId = null;
        state.apikey = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload.errorMessage;
        state.userId = null;
        state.email = null;
        state.token = null;
        state.deviceId = null;
        state.domain = null;
        state.companyId = null;
        state.apikey = null;
      });
  },
});

export const { clearError,setWebSocketSuccess} = authSlice.actions;
export default authSlice.reducer;
