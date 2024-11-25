// src/redux/permission/permissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';

// 异步操作：获取用户权限
export const fetchUserPermissions = createAsyncThunk(
  'permissions/fetchUserPermissions',
  async (userId, { rejectWithValue }) => { // 接收 userId 作为参数
    try {
      console.log('&&&fetchUserPermissions is called with userId:', userId);
      // 调用权限 API，传递 userId 参数
      const response = await authApi.post('/permissions/getUserPermission', { userId });
      console.log('****response',response);

      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        const errorMessage = response.data.error[0].errorMessage || '権限取得失敗';
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        return rejectWithValue(error.response.data.error[0].errorMessage);
      }
      return rejectWithValue(error.response?.data?.message || '権限取得失敗');
    }
  }
);

// 创建权限切片
const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: null,
    status: 'idle', // 状态：idle, loading, succeeded, failed
    error: null,
  },
  reducers: {
    resetPermissions: (state) => {
      state.permissions = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.permissions = action.payload;
        console.log('****Fetched Permissions:', action.payload);
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch permissions';
      });
  },
});

// 导出 actions 和 reducer
export const { resetPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
