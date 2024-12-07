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
        `/application/list?applicantId=${applicantId}`,
        null,
        'GET',
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
        '/application/add',
        applicationData,
        'POST',
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
        '/application/update',
        applicationData,
        'POST',
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

// 创建 applicationSlice
const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [], // 申请信息列表
    isLoading: false, // 加载状态
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // 处理 fetchApplications 操作
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true; // 设置加载状态为 true
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.applications = action.payload; // 保存获取的申请信息
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
      })

      // 处理 addApplication 操作
      .addCase(addApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload); // 添加新的申请信息
      })
      .addCase(addApplication.rejected, (state, action) => {
        state.isLoading = false;
      })

      // 处理 updateApplication 操作
      .addCase(updateApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedApplication = action.payload;
        const index = state.applications.findIndex((app) => app.id === updatedApplication.id);
        if (index !== -1) {
          state.applications[index] = updatedApplication; // 更新申请信息
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// 导出 actions 和 reducer
export const { } = applicationSlice.actions;
export default applicationSlice.reducer;
