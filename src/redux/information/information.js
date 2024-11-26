// src/redux/information/informationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiHandler } from '../../services/ApiService'; // 通用API处理函数
import { authApi } from '../../services/ApiService'; // 引入API实例

/**
 * 异步操作：获取信息列表
 * @param {number} recipientUserId - 接收者用户ID
 */
export const fetchInformationList = createAsyncThunk(
  'information/fetchInformationList',
  (recipientUserId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/information/list?recipientUserId=${recipientUserId}`,
        null,
        'GET',
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

// 创建信息 Slice
const informationSlice = createSlice({
  name: 'information',
  initialState: {
    informationList: [], // 信息列表
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
  },
  extraReducers: (builder) => {
    builder
      // 处理 fetchInformationList 操作
      .addCase(fetchInformationList.pending, (state) => {
        state.isLoading = true; // 设置加载状态为 true
      })
      .addCase(fetchInformationList.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.informationList = action.payload.data; // 保存获取的信息列表
      })
      .addCase(fetchInformationList.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
      });
  },
});

// 导出 actions 和 reducer
export const { clearError } = informationSlice.actions;
export default informationSlice.reducer;