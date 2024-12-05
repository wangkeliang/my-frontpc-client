// src/redux/login/registerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';
/**
 * 注册用户
 */
export const registerUser = createAsyncThunk(
  'register/registerUser',
  (userData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        publicApi,
        '/auth/register',
        userData,
        'POST',
        // 成功回调
        (responseData) => resolve({ ...responseData, email: userData.email }),
        // 失败回调
        ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
        // 错误回调
        ({ errorMessage }) => reject(rejectWithValue('登録に失敗しました。もう一度お試しください。'))
      );
    });
  }
);

/**
 * 重新发送确认邮件
 */
export const resendConfirmationEmail = createAsyncThunk(
  'register/resendConfirmationEmail',
  (email, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        publicApi,
        '/auth/resend-confirmation-email',
        { email },
        'POST',
        // 成功回调
        (responseData) => resolve(responseData),
        // 失败回调
        ({ errorMessage }) => reject(rejectWithValue(errorMessage || 'メールの再送に失敗しました。')),
        // 错误回调
        ({ errorMessage }) => reject(rejectWithValue('メールの再送に失敗しました。'))
      );
    });
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    status: 'idle', // idle, loading, succeeded, failed
    formError: '', // 记录异步操作的错误信息
    email: '', // 存储注册用户的 email
  },
  reducers: {
    setFormError: (state, action) => {
      state.formError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formError = ''; // 注册成功后清空错误信息
        state.email = action.payload.email; // 存储用户的 email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.formError = action.payload; // 注册失败时显示错误信息
      })
      .addCase(resendConfirmationEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resendConfirmationEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resendConfirmationEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.formError = action.payload;
      });
  },
});

export const { setFormError } = registerSlice.actions;
export default registerSlice.reducer;
