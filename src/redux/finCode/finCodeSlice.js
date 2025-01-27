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
          console.log('****globalPopupError=',globalPopupError);
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
 * 异步操作：注册支付 (register-payment)
 */
export const registerPayment = createAsyncThunk(
  'finCode/registerPayment',
  (paymentInfo, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/fincode/register-payment`,
        paymentInfo,  // 直接传递 paymentInfo 对象
        'POST',
        (responseData) => resolve(responseData), // 成功回调
        (localError) => {
          reject(rejectWithValue(localError)); // 局部错误处理
        },
        (globalPopupError) => {
          console.log('****globalPopupError=', globalPopupError);
          reject(rejectWithValue(globalPopupError)); // 全局错误处理
        }
      );
    });
  }
);
/**
 * 异步操作：处理支付请求 (process-payment)
 */
export const processPayment = createAsyncThunk(
  'finCode/processPayment',
  (paymentInfo, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/fincode/process-payment`,
        paymentInfo,  // 直接传递 paymentInfo 对象
        'POST',
        (responseData) => resolve(responseData), // 成功回调
        (localError) => {
          reject(rejectWithValue(localError)); // 局部错误处理
        },
        (globalPopupError) => {
          console.log('****globalPopupError=', globalPopupError);
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
    registerPaymentData: null, // 注册支付返回的数据
    paymentData: null, // 支付返回的数据
    cardPaymentWebhookResult: null, // 存储 card_payment_webhook 结果
    bankPaymentWebhookResult:null,
    fetchCustomerLoading: false, // 加载状态
    fetchCardsLoading: false, // 加载信用卡列表状态
    registerPaymentLoading: false, // 注册支付状态
    processPaymentLoading: false, // 处理支付状态
    
  },
  reducers: {
    setCardPaymentWebhookResult: (state, action) => {
      state.cardPaymentWebhookResult = action.payload;
    },
    setBankPaymentWebhookResult: (state, action) => {
      state.bankPaymentWebhookResult = action.payload;
    },
    clearFinCodeData: (state) => {
      state.customerData = null; // 清空 customer 数据
      state.cardsData = []; // 清空信用卡列表
      state.paymentData = null; // 清空支付数据
      state.registerPaymentData = null; // 清空注册支付数据
      state.paymentData= null; 
      state.cardPaymentWebhookResult= null; 
      state.bankPaymentWebhookResult= null; 
    },

    // 单独清空 customerData
    clearCustomerData: (state) => {
      state.customerData = null;
    },

    // 单独清空 cardsData
    clearCardsData: (state) => {
      state.cardsData = [];
    },

    // 单独清空 registerPaymentData
    clearRegisterPaymentData: (state) => {
      state.registerPaymentData = null;
    },

    // 单独清空 paymentData
    clearPaymentData: (state) => {
      state.paymentData = null;
    },

    // 单独清空 cardPaymentWebhookResult
    clearCardPaymentWebhookResult: (state) => {
      state.cardPaymentWebhookResult = null;
    },
    // 单独清空 bankPaymentWebhookResult
    clearBankPaymentWebhookResult: (state) => {
      state.bankPaymentWebhookResult = null;
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
      })

      // registerPayment
      .addCase(registerPayment.pending, (state) => {
        state.registerPaymentLoading = true; // 设置注册支付处理中状态
      })
      .addCase(registerPayment.fulfilled, (state, action) => {
        state.registerPaymentLoading = false; // 处理完成
        state.registerPaymentData = action.payload; // 保存注册支付结果数据
        console.log('*****registerPayment response:', action.payload);
      })
      .addCase(registerPayment.rejected, (state) => {
        state.registerPaymentLoading = false; // 处理失败
      })

      // processPayment
      .addCase(processPayment.pending, (state) => {
        state.processPaymentLoading = true; // 设置支付处理中状态
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.processPaymentLoading = false; // 处理完成
        state.paymentData = action.payload; // 保存支付结果数据
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.processPaymentLoading = false; // 处理失败
      });

  },
});

// 导出 actions 和 reducer
export const { 
  clearFinCodeData,
  setCardPaymentWebhookResult,
  setBankPaymentWebhookResult,
  clearCardsData, 
  clearRegisterPaymentData, 
  clearPaymentData, 
  clearCardPaymentWebhookResult,
  clearBankPaymentWebhookResult,
} = finCodeSlice.actions;
export default finCodeSlice.reducer;
