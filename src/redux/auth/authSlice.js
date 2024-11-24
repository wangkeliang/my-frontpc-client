import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiHandler } from '../../utils/apiHandler'; // 引入通用的处理函数
import { publicApi, authApi } from '../../services/ApiService'; // 引入 API 实例
import { getDeviceId } from '../../utils/Common'; // 引用共通方法

// 异步登录操作
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    const deviceId = getDeviceId();
    const data = { email, password, deviceId };

    return new Promise((resolve, reject) => {
      apiHandler(
        publicApi,
        '/auth/login',
        data,
        // 成功回调
        (responseData) => {
          const { token, deviceId, userId, email,apikey } = responseData;
          localStorage.setItem('token', token);
          localStorage.setItem('deviceId', deviceId);
          localStorage.setItem('userId', userId);
          localStorage.setItem('email', email);
          resolve({ token, deviceId, userId, email,apikey });
        },
        // 失败回调
        ({ errorMessage }) => {
          reject(rejectWithValue(errorMessage));
        },
        // 错误回调
        ({ errorMessage }) => {
          reject(rejectWithValue(errorMessage));
        }
      );
    });
  }
);

// 异步登出操作
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    const { userId, deviceId } = getState().auth;

    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/auth/logout',
        { userId, deviceId },
        // 成功回调
        () => {
          localStorage.removeItem('token');
          localStorage.removeItem('deviceId');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          window.location.href = '/login';
          resolve(true);
        },
        // 失败回调
        ({ errorMessage }) => {
          localStorage.removeItem('token');
          localStorage.removeItem('deviceId');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          window.location.href = '/login';
          reject(rejectWithValue(errorMessage));
        },
        // 错误回调
        ({ errorMessage }) => {
          localStorage.removeItem('token');
          localStorage.removeItem('deviceId');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          window.location.href = '/login';
          reject(rejectWithValue(errorMessage));
        }
      );
    });
  }
);

// 心跳检测
export const startHeartbeat = createAsyncThunk(
  'auth/startHeartbeat',
  async (_, { getState, dispatch }) => {
    const { token, userId, deviceId } = getState().auth;
    if (!userId || !deviceId || !token) return;

    apiHandler(
      authApi,
      '/session/keep-alive',
      { userId, deviceId },
      // 成功回调
      () => {
        // `status` 判断已在 `apiHandler` 内部处理，不再需要在这里判断
      },
      // 失败回调
      () => {
        dispatch(logoutUser());
      },
      // 错误回调
      () => {
        dispatch(logoutUser());
      }
    );
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    email: null,
    token: null,
    deviceId: null,
    apikey:null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.deviceId = action.payload.deviceId;
        state.apikey = action.payload.apikey;
        console.log('***action.payload.apikey=',action.payload.apikey);
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userId = null;
        state.email = null;
        state.token = null;
        state.deviceId = null;
        state.apikey = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userId = null;
        state.email = null;
        state.token = null;
        state.deviceId = null;
        state.apikey = null;
      })
      .addCase(startHeartbeat.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
