// src/redux/login/registerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';
/**
 * 注册用户
 */
export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        publicApi,
        '/auth/register',
        userData,
        'POST',
        // 成功回调
        (responseData) => resolve({ ...responseData, email: userData.email }),
        // 回调错误信息显示到当前页面
        (localError) => {
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到全局错误捕获PopUp组件
        (GlobalPopupError) => {
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

/**
 * 重新发送确认邮件
 */
export const resendConfirmationEmail = createAsyncThunk(
  'register/resendConfirmationEmail',
  async (email, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        publicApi,
        '/auth/resend-confirmation-email',
        { email },
        'POST',
        // 成功回调
        (responseData) => resolve(responseData),
        // 回调错误信息显示到当前页面
        (localError) => {
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到全局错误捕获PopUp组件
        (GlobalPopupError) => {
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    status: 'idle', // idle, loading, succeeded, failed
    email: '', // 存储注册用户的 email
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.email = action.payload.email; // 存储用户的 email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(resendConfirmationEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resendConfirmationEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resendConfirmationEmail.rejected, (state, action) => {
        state.status = 'failed';   
      });     
  },
});

export default registerSlice.reducer;
