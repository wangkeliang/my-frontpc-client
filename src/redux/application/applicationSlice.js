import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取申请信息列表
 * @param {number} applicantId - 申请者ID
 */
export const fetchApplications = createAsyncThunk(
  'application/fetchApplications',
  (applicantId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/application/applications?applicantId=${applicantId}`,
        null,
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

/**
 * 异步操作：新增申请信息
 * @param {object} applicationData - 申请数据
 */
export const addApplication = createAsyncThunk(
  'application/addApplication',
  (applicationData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/application/applications/add`,
        applicationData,
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

/**
 * 异步操作：更新申请信息
 * @param {object} applicationData - 更新后的申请数据
 */
export const updateApplication = createAsyncThunk(
  'application/updateApplication',
  (applicationData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/application/applications/update`,
        applicationData,
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

// 创建 applicationSlice
const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [], // 申请信息列表
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
      // 处理 fetchApplications 操作
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true; // 设置加载状态为 true
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.applications = action.payload.data; // 保存获取的申请信息
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
      })

      // 处理 addApplication 操作
      .addCase(addApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload.data); // 添加新的申请信息
      })
      .addCase(addApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 处理 updateApplication 操作
      .addCase(updateApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedApplication = action.payload.data;
        const index = state.applications.findIndex((app) => app.id === updatedApplication.id);
        if (index !== -1) {
          state.applications[index] = updatedApplication; // 更新申请信息
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// 导出 actions 和 reducer
export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
