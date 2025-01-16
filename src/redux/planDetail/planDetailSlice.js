import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：从后端获取计划详细信息，使用 GET 方法
 */
export const fetchPlanDetail = createAsyncThunk(
  'planDetail/fetchPlanDetail',
  (requestData = {}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/plan-details/init', // 注意路径无 `/api`
        requestData, // 包含 planCode 和 companyDomain
        'GET', // GET 请求
        // 成功回调
        (responseData) => resolve(responseData),
        // 回调错误信息显示到当前页面
        (localError) => {
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到全局PopUp组件
        (GlobalPopupError) => {    
          console.log('slice 错误回调，GlobalPopupError.errorMessage=', GlobalPopupError.errorMessage); 
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

// 创建 planDetail slice
const planDetailSlice = createSlice({
  name: 'planDetail',
  initialState: {
    planDetail: null, // 保存计划详细信息
    isLoading: false, // 加载状态
  },
  reducers: {
    clearPlanDetail: (state) => {
      state.planDetail = null; // 清除计划信息
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanDetail.pending, (state) => {
        state.isLoading = true; // 开始加载
      })
      .addCase(fetchPlanDetail.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.planDetail = action.payload; // 保存计划详细信息
      })
      .addCase(fetchPlanDetail.rejected, (state) => {
        state.isLoading = false; // 加载失败
      });
  },
});

// 导出 actions 和 reducer
export const { clearPlanDetail } = planDetailSlice.actions;
export default planDetailSlice.reducer;
