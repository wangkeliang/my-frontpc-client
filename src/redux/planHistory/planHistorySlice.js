import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：生成新的 PlanHistory，使用 POST 方法
 */
export const createPlanHistory = createAsyncThunk(
  'planHistory/createPlanHistory',
  (requestData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/planhistory/create',
        requestData, // 包含公司 ID、计划代码等数据
        'POST',
        // 成功回调
        (responseData) => resolve(responseData),
        // 回调错误信息显示到当前页面
        (localError) => {
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到全局 PopUp 组件
        (GlobalPopupError) => {
          console.log('slice 错误回调，GlobalPopupError.errorMessage=', GlobalPopupError.errorMessage);
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

/**
 * 异步操作：获取当前公司的所有 PlanHistory
 */
export const fetchAllPlanHistories = createAsyncThunk(
  'planHistory/fetchAllPlanHistories',
  (companyId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/planhistory/all/${companyId}`,
        {}, // 不需要额外数据
        'GET',
        (responseData) => resolve(responseData),
        (localError) => {
          reject(rejectWithValue(localError));
        },
        (GlobalPopupError) => {
          console.log('slice 错误回调，GlobalPopupError.errorMessage=', GlobalPopupError.errorMessage);
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

/**
 * 异步操作：获取当前公司的活动 Plan
 */
export const fetchActivePlan = createAsyncThunk(
  'planHistory/fetchActivePlan',
  (companyId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/planhistory/active/${companyId}`,
        {},
        'GET',
        (responseData) => resolve(responseData),
        (localError) => {
          reject(rejectWithValue(localError));
        },
        (GlobalPopupError) => {
          console.log('slice 错误回调，GlobalPopupError.errorMessage=', GlobalPopupError.errorMessage);
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);

/**
 * 异步操作：激活 PlanHistory，使用 POST 方法
 */
export const activatePlanHistory = createAsyncThunk(
  'planHistory/activatePlanHistory',
  (requestData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/planhistory/activate',
        requestData, // 包含需要激活的 PlanHistory 的 ID 和其他参数
        'POST',
        // 成功回调
        (responseData) => resolve(responseData),
        // 回调错误信息显示到当前页面
        (localError) => {
          reject(rejectWithValue(localError));
        },
        // 回调错误信息显示抛到全局 PopUp 组件
        (GlobalPopupError) => {
          console.log('slice 错误回调，GlobalPopupError.errorMessage=', GlobalPopupError.errorMessage);
          reject(rejectWithValue(GlobalPopupError));
        }
      );
    });
  }
);
/**
 * 异步操作：获取 PlanHistory 详细信息
 */
export const fetchPlanHistoryDetail = createAsyncThunk(
    'planHistory/fetchPlanHistoryDetail',
    (planHistoryId, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        apiHandler(
          authApi,
          `/planhistory/detail/${planHistoryId}`, // API 路径
          {}, // 不需要额外数据
          'GET',
          (responseData) => resolve(responseData), // 成功回调
          (localError) => {
            reject(rejectWithValue(localError)); // 局部错误回调
          },
          (GlobalPopupError) => {
            console.log('slice 错误回调，GlobalPopupError.errorMessage=', GlobalPopupError.errorMessage);
            reject(rejectWithValue(GlobalPopupError)); // 全局错误回调
          }
        );
      });
    }
  );
  
// 创建 planHistory slice
const planHistorySlice = createSlice({
  name: 'planHistory',
  initialState: {
    planHistories: [], // 保存所有 PlanHistory 信息
    activePlan: null, // 保存当前活动的 Plan 信息
    selectedPlanHistory: null, // 保存选中的 PlanHistory 详细信息
    isCreatingLoading: false, // 创建 PlanHistory 的加载状态
    isFetchingAllLoading: false, // 获取所有 PlanHistories 的加载状态
    isFetchingActiveLoading: false, // 获取当前活动 Plan 的加载状态
    isActivatingLoading: false, // 激活 PlanHistory 的加载状态
    isFetchingDetailLoading: false, // 获取 PlanHistory 详细信息的加载状态
  },
  reducers: {
    clearPlanHistories: (state) => {
      state.planHistories = []; // 清除所有 PlanHistory 信息
    },
    clearActivePlan: (state) => {
      state.activePlan = null; // 清除活动 Plan 信息
    },
    clearSelectedPlanHistory: (state) => {
        state.selectedPlanHistory = null; // 清除选中的 PlanHistory 详细信息
      },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createPlanHistory.pending, (state) => {
      state.isCreatingLoading = true; // 创建加载中
    })
    .addCase(createPlanHistory.fulfilled, (state, action) => {
      state.isCreatingLoading = false; // 创建完成
      state.planHistories.push(action.payload); // 添加新生成的 PlanHistory
    })
    .addCase(createPlanHistory.rejected, (state) => {
      state.isCreatingLoading = false; // 创建失败
    })

    .addCase(fetchAllPlanHistories.pending, (state) => {
      state.isFetchingAllLoading = true; // 开始加载
    })
    .addCase(fetchAllPlanHistories.fulfilled, (state, action) => {
      state.isFetchingAllLoading = false; // 加载完成
      state.planHistories = action.payload; // 保存所有 PlanHistory 信息
    })
    .addCase(fetchAllPlanHistories.rejected, (state) => {
      state.isFetchingAllLoading = false; // 加载失败
    })

    .addCase(fetchActivePlan.pending, (state) => {
      state.isFetchingActiveLoading = true; // 开始加载
    })
    .addCase(fetchActivePlan.fulfilled, (state, action) => {
      state.isFetchingActiveLoading = false; // 加载完成
      state.activePlan = action.payload; // 保存活动 Plan 信息
    })
    .addCase(fetchActivePlan.rejected, (state) => {
      state.isFetchingActiveLoading = false; // 加载失败
    })

    .addCase(activatePlanHistory.pending, (state) => {
      state.isActivatingLoading = true; // 开始加载
    })
    .addCase(activatePlanHistory.fulfilled, (state, action) => {
      state.isActivatingLoading = false; // 加载完成
      const updatedPlanHistory = action.payload;
      const index = state.planHistories.findIndex(
        (plan) => plan.id === updatedPlanHistory.id
      );
      if (index !== -1) {
        state.planHistories[index] = updatedPlanHistory; // 更新已激活的 PlanHistory 信息
      }
    })
    .addCase(activatePlanHistory.rejected, (state) => {
      state.isActivatingLoading = false; // 加载失败
    })

    .addCase(fetchPlanHistoryDetail.pending, (state) => {
      state.isFetchingDetailLoading = true; // 开始加载
    })
    .addCase(fetchPlanHistoryDetail.fulfilled, (state, action) => {
      state.isFetchingDetailLoading = false; // 加载完成
      state.selectedPlanHistory = action.payload; // 保存 PlanHistory 详细信息
    })
    .addCase(fetchPlanHistoryDetail.rejected, (state) => {
      state.isFetchingDetailLoading = false; // 加载失败
    });
  },
});

// 导出 actions 和 reducer
export const { clearPlanHistories, clearActivePlan } = planHistorySlice.actions;
export default planHistorySlice.reducer;
