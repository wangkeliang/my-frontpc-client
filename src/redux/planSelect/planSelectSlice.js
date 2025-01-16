import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取可选计划列表
 */
export const fetchPlanSelect = createAsyncThunk(
  'planSelect/fetchPlanSelect',
  (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/plan-select/init',
        {}, // 无需请求体
        'GET',
        (responseData) => resolve(responseData), // 成功回调
        (localError) => {
          reject(rejectWithValue(localError)); // 局部错误处理
        },
        (globalPopupError) => {
          console.log('slice 错误回调，globalPopupError.errorMessage=', globalPopupError.errorMessage);
          reject(rejectWithValue(globalPopupError)); // 全局错误处理
        }
      );
    });
  }
);

/**
 * 创建 planSelectSlice
 */
const planSelectSlice = createSlice({
  name: 'planSelect',
  initialState: {
    plans: [], // 存储计划列表
    planSelectLoading: false, // 加载状态
  },
  reducers: {
    clearPlans: (state) => {
      state.plans = []; // 清空计划列表
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanSelect.pending, (state) => {
        state.planSelectLoading = true; // 设置加载状态
      })
      .addCase(fetchPlanSelect.fulfilled, (state, action) => {
        state.planSelectLoading = false; // 加载完成
        state.plans = action.payload; // 保存计划数据
        console.log('*****action.payload.data=',action.payload);
      })
      .addCase(fetchPlanSelect.rejected, (state) => {
        state.planSelectLoading = false; // 加载失败
      });
  },
});

// 导出 actions 和 reducer
export const { clearPlans } = planSelectSlice.actions;
export default planSelectSlice.reducer;
