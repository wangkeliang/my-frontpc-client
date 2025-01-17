import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取计划购买初始化数据
 */
export const fetchPlanPurchase = createAsyncThunk(
  'planPurchase/fetchPlanPurchase',
  ({ planCode, companyId }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/plan-purchase/init?planCode=${planCode}&companyId=${companyId}`,
        {}, // 无需请求体
        'GET',
        (responseData) => resolve(responseData), // 成功回调
        (localError) => {
          reject(rejectWithValue(localError)); // 局部错误处理
        },
        (globalPopupError) => {
          reject(rejectWithValue(globalPopupError)); // 全局错误处理
        }
      );
    });
  }
);

/**
 * 异步操作：执行计划购买操作
 */
export const executePlanPurchase = createAsyncThunk(
  'planPurchase/executePlanPurchase',
  (purchaseData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/plan-purchase/purchase',
        purchaseData, // 请求体数据
        'POST',
        (responseData) => resolve(responseData), // 成功回调
        (localError) => {
          reject(rejectWithValue(localError)); // 局部错误处理
        },
        (globalPopupError) => {
          reject(rejectWithValue(globalPopupError)); // 全局错误处理
        }
      );
    });
  }
);

/**
 * 创建 planPurchaseSlice
 */
const planPurchaseSlice = createSlice({
  name: 'planPurchase',
  initialState: {
    planDetails: null, // 保存计划购买初始化数据
    planPurchaseLoading: false, // 加载状态
    purchaseExecutionLoading: false, // 执行购买的加载状态
    purchaseResult: null, // 购买操作的结果
  },
  reducers: {
    clearPlanPurchase: (state) => {
      state.planDetails = null; // 清空计划详情
      state.purchaseResult = null; // 清空购买结果
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPlanPurchase
      .addCase(fetchPlanPurchase.pending, (state) => {
        state.planPurchaseLoading = true; // 设置加载状态
      })
      .addCase(fetchPlanPurchase.fulfilled, (state, action) => {
        state.planPurchaseLoading = false; // 加载完成
        state.planDetails = action.payload; // 保存计划数据
        console.log('*****action.payload.data=', action.payload);
      })
      .addCase(fetchPlanPurchase.rejected, (state) => {
        state.planPurchaseLoading = false; // 加载失败
      })
      // executePlanPurchase
      .addCase(executePlanPurchase.pending, (state) => {
        state.purchaseExecutionLoading = true; // 设置执行加载状态
      })
      .addCase(executePlanPurchase.fulfilled, (state, action) => {
        state.purchaseExecutionLoading = false; // 执行完成
        state.purchaseResult = action.payload; // 保存购买结果
        console.log('*****executePlanPurchase response:', action.payload);
      })
      .addCase(executePlanPurchase.rejected, (state) => {
        state.purchaseExecutionLoading = false; // 执行失败
      });
  },
});

// 导出 actions 和 reducer
export const { clearPlanPurchase } = planPurchaseSlice.actions;
export default planPurchaseSlice.reducer;
