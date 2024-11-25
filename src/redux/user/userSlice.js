// src/redux/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取用户信息
 * @param {number} userId - 用户ID
 */
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  (userId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/users/info?userId=${userId}`,
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
 * 异步操作：获取经理信息
 * @param {number} userId - 用户ID
 */
export const fetchManagerInfo = createAsyncThunk(
  'user/fetchManagerInfo',
  (userId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/users/manager/info?userId=${userId}`,
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
 * 异步操作：更新用户信息
 * @param {object} userData - 用户数据
 */
export const updateUser = createAsyncThunk(
  'user/updateUser',
  (userData, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/users/update`,
        userData,
        'POST',
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
 * 异步操作：获取用户角色
 * @param {number} userId - 用户ID
 */
export const fetchUserRoles = createAsyncThunk(
  'user/fetchUserRoles',
  (userId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/users/roles?userId=${userId}`,
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
 * 异步操作：设置用户角色
 * @param {object} userRoles - 用户角色数据
 */
export const setUserRoles = createAsyncThunk(
  'user/userRoles/set',
  (userRoles, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/users/user/setRoles`,
        userRoles,
        'POST',
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
 * 异步操作：将用户权限从 user_roles_application 表迁移到 user_roles 表
 * @param {object} params - 包含 executorUserId 和 targetUserId 的对象
 */
export const transferUserRolesFromApplications = createAsyncThunk(
    'user/transferUserRolesFromApplications',
    ({targetUserId }, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        apiHandler(
          authApi,
          `/users/roles/transfer`,
          {targetUserId },
          'POST',
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
 * 异步操作：设置角色应用
 * @param {object} roleApplications - 角色应用数据
 */
export const setRoleApplications = createAsyncThunk(
  'user/roleApplications/set',
  (roleApplications, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/users/roleApplications/set`,
        roleApplications,
        'POST',
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
 * 异步操作：获取角色应用
 * @param {number} userId - 用户ID
 */
export const fetchRoleApplications = createAsyncThunk(
  'user/fetchRoleApplications',
  (userId, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/users/roleApplications?userId=${userId}`,
        null,
        'GET',
        (responseData) => resolve(responseData),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage)),
        ({ errorMessage }) => reject(rejectWithValue(errorMessage))
      );
    });
  }
);

// 创建用户 Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    managerInfo: null,
    userRoles: [],
    roleApplications: [],
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
    /**
     * 更新 userInfo
     */
    updateUserInfo(state, action) {
        state.userInfo = { ...state.userInfo, ...action.payload }; // 合并更新字段
      },
      /**
       * 更新 managerInfo
       */
      updateManagerInfo(state, action) {
        state.managerInfo = { ...state.managerInfo, ...action.payload }; // 合并更新字段
      },
      /**
       * 更新 userRoles
       */
      updateUserRoles(state, action) {
        state.userRoles = action.payload; // 替换整个角色数组
      },
      /**
       * 更新 roleApplications
       */
      updateRoleApplications(state, action) {
        state.roleApplications = action.payload; // 替换整个角色应用数组
      },
  },
  extraReducers: (builder) => {
    builder
      // 处理 fetchUserInfo 操作
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true; // 加载状态设置为 true
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        console.log('****fetchUserInfo.fulfilled action.payload=',action.payload);
        state.userInfo = action.payload; // 保存用户信息
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
      })

      // 处理 fetchManagerInfo 操作
      .addCase(fetchManagerInfo.pending, (state) => {
        state.isLoading = true; // 加载状态设置为 true
      })
      .addCase(fetchManagerInfo.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.managerInfo = action.payload; // 保存经理信息
      })
      .addCase(fetchManagerInfo.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
      })

      // 处理 updateUser 操作
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true; // 加载状态设置为 true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.userInfo = action.payload; // 更新用户信息
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
        console.log('****state.error=',state.error);
      })

      // 处理 fetchUserRoles 操作
      .addCase(fetchUserRoles.pending, (state) => {
        state.isLoading = true; // 加载状态设置为 true
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.userRoles = action.payload; // 保存用户角色信息
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
      })

      // 处理 setUserRoles 操作
      .addCase(setUserRoles.pending, (state) => {
        state.isLoading = true; // 加载状态设置为 true
      })
      .addCase(setUserRoles.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.userRoles = action.payload; // 更新用户角色信息
      })
      .addCase(setUserRoles.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
        console.log('****state.error=',state.error);
      })

    // 处理 transferUserRolesFromApplications 操作
    .addCase(transferUserRolesFromApplications.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(transferUserRolesFromApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRoles = action.payload; // 更新用户角色信息
        })
        .addCase(transferUserRolesFromApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        })

      // 处理 setRoleApplications 操作
      .addCase(setRoleApplications.pending, (state) => {
        state.isLoading = true; // 加载状态设置为 true
      })
      .addCase(setRoleApplications.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.roleApplications = action.payload; // 保存角色应用信息
      })
      .addCase(setRoleApplications.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
      })

      // 处理 fetchRoleApplications 操作
      .addCase(fetchRoleApplications.pending, (state) => {
        state.isLoading = true; // 加载状态设置为 true
      })
      .addCase(fetchRoleApplications.fulfilled, (state, action) => {
        state.isLoading = false; // 加载完成
        state.roleApplications = action.payload; // 保存角色应用信息
      })
      .addCase(fetchRoleApplications.rejected, (state, action) => {
        state.isLoading = false; // 加载失败
        state.error = action.payload; // 保存错误信息
      });
  },
});

// 导出 actions 和 reducer
export const { clearError, updateUserInfo, updateManagerInfo, updateUserRoles, updateRoleApplications } = userSlice.actions;
export default userSlice.reducer;
