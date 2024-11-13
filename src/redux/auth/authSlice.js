// src/redux/login/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicApi, authApi } from '../../services/ApiService';
import { getDeviceId } from '../../utils/Common'; // 引用共通方法

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('**registerUser is begin');
      console.log(userData);
      const response = await publicApi.post('/auth/register', userData);
      console.log('response=',response);
      if (response.data.status !== 'success') {
        const errorMessage = response.data.error?.[0]?.errorMessage;
        console.log(errorMessage);
        return rejectWithValue(errorMessage);
      }
      return { ...response.data, email: userData.email }; // 返回 email 用于存储
    } catch (error) {
      if (error?.response?.data?.error) {
        return rejectWithValue(error.response.data.error[0].errorMessage);
      }
      return rejectWithValue('登録に失敗しました。もう一度お試しください。');
    }
  }
);

// 异步登录操作
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const deviceId = getDeviceId(); // 使用共通方法
      const response = await publicApi.post('/auth/login', { email, password, deviceId });

      if (response.data.status === 'success') {
        const { token, deviceId, userId, email } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('deviceId', deviceId);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        return { token, deviceId, userId, email };
      } else {
        const errorMessage = response.data.error[0].errorMessage || 'ログインに失敗しました';
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        return rejectWithValue(error.response.data.error[0].errorMessage);
      }
      return rejectWithValue(error.response?.data?.message || 'ログインに失败しました');
    }
  }
);

// 异步登出操作
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userId, deviceId } = getState().auth;
      if (!userId || !deviceId) throw new Error('User not logged in');
      console.log('logout is called');
      console.log('userId=', userId);
      console.log('deviceId=', deviceId);

      const response = await authApi.post('/auth/logout', { userId, deviceId });

      // 清理本地存储和状态
      localStorage.removeItem('token');
      localStorage.removeItem('deviceId');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      // 跳转到登录页面
      window.location.href = '/login';
      
      return true; // 表示登出成功
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('deviceId');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      window.location.href = '/login';
    }
  }
);

// 心跳检测
export const startHeartbeat = createAsyncThunk(
  'auth/startHeartbeat',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      console.log('startHeartbeat is called');
      const { token, userId, deviceId } = getState().auth;
      if (!userId || !deviceId || !token) return;

      const response = await authApi.post('/session/keep-alive', { userId, deviceId });
      console.log(response);

      if (response.data.status !== 'success') {
        dispatch(logoutUser()); // 使用 dispatch 调用 logoutUser
      }
    } catch (error) {
      dispatch(logoutUser()); // 使用 dispatch 调用 logoutUser
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    email: null,
    token: null,
    deviceId: null,
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
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userId = null;
        state.email = null;
        state.token = null;
        state.deviceId = null;
      })
      .addCase(startHeartbeat.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
