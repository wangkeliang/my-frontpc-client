// src/redux/master/masterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取角色主数据
 * @param {number} userType - 用户类型
 */
export const fetchRoleMaster = createAsyncThunk(
  'master/fetchRoleMaster',
  async (userType, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      const url = `/master/roleMasters?userType=${userType}`; // 拼接查询参数到 URL
      apiHandler(
        authApi, // API 实例
        url, // 完整的 URL
        null, // 不需要请求体
        'GET', // 使用 GET 方法
        // 成功回调
        (responseData) => resolve(responseData),
        // 回调错误信息显示到当前页面
        (localError) => {
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到全局PopUp组件
        (GlobalPopupError) => {    
          console.log('slice 错误回调，GlobalPopupError.errorMessage=',GlobalPopupError.errorMessage); 
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

// 创建 Master Slice
const masterSlice = createSlice({
  name: 'master',
  initialState: {
    roleMaster: [],
    isLoading: false,
  },
  reducers: { },
  extraReducers: (builder) => {
    builder
      // 处理 fetchRoleMaster 操作
      .addCase(fetchRoleMaster.pending, (state) => {
        state.isLoading = true; // 开始加载
      })
      .addCase(fetchRoleMaster.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.roleMaster = action.payload || []; // 保存返回数据
      })
      .addCase(fetchRoleMaster.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
      });
  },
});

// 导出 actions 和 reducer
export const { } = masterSlice.actions;
export default masterSlice.reducer;
