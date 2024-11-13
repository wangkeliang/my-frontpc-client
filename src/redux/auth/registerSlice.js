// src/redux/login/registerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicApi } from '../../services/ApiService';

export const registerUser = createAsyncThunk(
  'register/registerUser',
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

export const resendConfirmationEmail = createAsyncThunk(
  'register/resendConfirmationEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await publicApi.post('/auth/resend-confirmation-email', { email });
      if (response.data.status !== 'success') {
        return rejectWithValue('メールの再送に失敗しました。');
      }
      return response.data;
    } catch (error) {
      if (error?.response?.data?.error) {
        return rejectWithValue(error.response.data.error[0].errorMessage);
      }
      return rejectWithValue('メールの再送に失敗しました。');
    }
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
