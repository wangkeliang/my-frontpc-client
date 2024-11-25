// src/redux/company/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取公司信息
 * @param {number} companyId - 公司ID
 */
export const fetchCompanyInfo = createAsyncThunk(
  'company/fetchCompanyInfo',
  (companyId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/company/info?companyId=${companyId}`,
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

/**
 * 异步操作：根据域名获取公司信息
 * @param {string} domain - 公司域名
 */
export const fetchCompanyByDomain = createAsyncThunk(
    'company/fetchCompanyByDomain',
    (domain, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        apiHandler(
          authApi,
          `/company/bydomain?domain=${domain}`,
          null,
          'GET',
          (responseData) => resolve(responseData),
          ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
          ({ errorMessage }) => reject(rejectWithValue(errorMessage))
        );
      });
    }
  );


/**
 * 异步操作：添加公司
 * @param {object} companyData - 公司数据
 */
export const addCompany = createAsyncThunk(
  'company/addCompany',
  (companyData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/company/add',
        companyData,
        'POST',
        (responseData) => resolve(responseData),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage))
      );
    });
  }
);

/**
 * 异步操作：更新公司信息
 * @param {object} companyData - 公司数据
 */
export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  (companyData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/company/update',
        companyData,
        'POST',
        (responseData) => resolve(responseData),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage))
      );
    });
  }
);

/**
 * 异步操作：获取公司成员
 * @param {number} companyId - 公司ID
 */
export const fetchCompanyMembers = createAsyncThunk(
  'company/fetchCompanyMembers',
  (companyId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/company/members?companyId=${companyId}`,
        null,
        'GET',
        (responseData) => resolve(responseData),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage))
      );
    });
  }
);

/**
 * 异步操作：获取公司管理员
 * @param {number} companyId - 公司ID
 */
export const fetchCompanyAdmins = createAsyncThunk(
  'company/fetchCompanyAdmins',
  (companyId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/company/admins?companyId=${companyId}`,
        null,
        'GET',
        (responseData) => resolve(responseData),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage))
      );
    });
  }
);

// 创建公司 Slice
const companySlice = createSlice({
  name: 'company',
  initialState: {
    companyInfo: null,
    companyMembers: [],
    companyAdmins: [],
    isLoading: false,
    error: null,
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
      // 处理 fetchCompanyInfo 操作
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyInfo = action.payload;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 处理 fetchCompanyByDomain 操作
      .addCase(fetchCompanyByDomain.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyByDomain.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyInfo = action.payload;
      })
      .addCase(fetchCompanyByDomain.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      

      // 处理 addCompany 操作
      .addCase(addCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyInfo = action.payload;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 处理 updateCompany 操作
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyInfo = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 处理 fetchCompanyMembers 操作
      .addCase(fetchCompanyMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyMembers = action.payload;
      })
      .addCase(fetchCompanyMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 处理 fetchCompanyAdmins 操作
      .addCase(fetchCompanyAdmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyAdmins = action.payload;
      })
      .addCase(fetchCompanyAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// 导出 actions 和 reducer
export const { clearError } = companySlice.actions;
export default companySlice.reducer;
