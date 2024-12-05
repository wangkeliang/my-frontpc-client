// src/redux/permission/permissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取用户权限
 */
export const fetchUserPermissions = createAsyncThunk(
  'permissions/fetchUserPermissions',
  (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/permissions/userPermissions`, // 不需要传递参数
        null,
        'GET', // GET 请求
        // 成功回调
        (responseData) => resolve(responseData),
        // 失败回调
        ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
        // 错误回调
        ({ errorMessage }) => reject(rejectWithValue(errorMessage))
      );
    });
  }
);

// 创建权限切片
const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissioninfo: null, // 用户权限数据
    refreshPermissionFlag:true,
    permissionSuccess:false,
    isLoading: false, // 加载状态
    error: null, // 错误信息
  },
  reducers: {
    /**
     * 清除错误信息
     * 用于在需要时重置错误状态
     */
    clearError(state) {
      state.error = null;
    },
    setPermissionSuccess: (state, action) => { // 新增 reducer
      state.permissioninfo = action.payload;
    },
    setRefreshPermissionFlag: (state, action) => { // 新增 reducer
      state.refreshPermissionFlag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 处理 fetchUserPermissions 操作
      .addCase(fetchUserPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.permissionSuccess=false;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissioninfo = action.payload; // 保存权限数据
        state.permissionSuccess=true;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // 保存错误信息
        state.permissionSuccess=false;
      });
  },
});

// 导出 actions 和 reducer
export const { clearError,setPermissionSuccess,setRefreshPermissionFlag} = permissionSlice.actions;
export default permissionSlice.reducer;
