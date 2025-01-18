import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取 FinCode Customer 信息
 */
export const fetchFinCodeCustomer = createAsyncThunk(
  'finCode/fetchFinCodeCustomer',
  ({ companyId, userId }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/fincode/get-fincode-customer?companyId=${companyId}&userId=${userId}`,
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
 * 异步操作：获取指定客户的信用卡列表
 */
export const fetchFinCodeCards = createAsyncThunk(
  'finCode/fetchFinCodeCards',
  ({ companyId }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/fincode/get-fincode-cards?companyId=${companyId}`,
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
 * 创建 finCodeSlice
 */
const finCodeSlice = createSlice({
  name: 'finCode',
  initialState: {
    customerData: null, // 保存获取的 FinCode Customer 数据
    cardsData: [], // 保存信用卡列表
    fetchCustomerLoading: false, // 加载状态
    fetchCardsLoading: false, // 加载信用卡列表状态
  },
  reducers: {
    clearFinCodeData: (state) => {
      state.customerData = null; // 清空 customer 数据
      state.cardsData = []; // 清空信用卡列表
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFinCodeCustomer
      .addCase(fetchFinCodeCustomer.pending, (state) => {
        state.fetchCustomerLoading = true; // 设置加载状态
      })
      .addCase(fetchFinCodeCustomer.fulfilled, (state, action) => {
        state.fetchCustomerLoading = false; // 加载完成
        state.customerData = action.payload; // 保存 customer 数据
        console.log('*****fetchFinCodeCustomer response:', action.payload);
      })
      .addCase(fetchFinCodeCustomer.rejected, (state) => {
        state.fetchCustomerLoading = false; // 加载失败
      })
      // fetchFinCodeCards
      .addCase(fetchFinCodeCards.pending, (state) => {
        state.fetchCardsLoading = true; // 设置信用卡列表加载状态
      })
      .addCase(fetchFinCodeCards.fulfilled, (state, action) => {
        state.fetchCardsLoading = false; // 加载完成
        state.cardsData = action.payload; // 保存信用卡列表数据
        console.log('*****fetchFinCodeCards response:', action.payload);
      })
      .addCase(fetchFinCodeCards.rejected, (state) => {
        state.fetchCardsLoading = false; // 加载失败
      });
  },
});

// 导出 actions 和 reducer
export const { clearFinCodeData } = finCodeSlice.actions;
export default finCodeSlice.reducer;
