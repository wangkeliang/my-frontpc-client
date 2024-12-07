// src/redux/permission/permissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：获取用户权限
 */
export const fetchUserPermissions = createAsyncThunk(
  'permissions/fetchUserPermissions',
  (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        `/permissions/userPermissions`, // 不需要传递参数
        null,
        'GET', // GET 请求
        // 成功回调
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

// 创建权限切片
const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissioninfo: null, // 用户权限数据
    refreshPermissionFlag:true,
    permissionSuccess:false,
    isLoading: false, // 加载状态
  },
  reducers: {
    setPermissionSuccess: (state, action) => { // 新增 reducer
      state.permissioninfo = action.payload;
    },
    setRefreshPermissionFlag: (state, action) => { // 新增 reducer
      state.refreshPermissionFlag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 处理 fetchUserPermissions 操作
      .addCase(fetchUserPermissions.pending, (state) => {
        state.isLoading = true;
        state.permissionSuccess=false;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissioninfo = action.payload; // 保存权限数据
        state.permissionSuccess=true;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.permissionSuccess=false;
      });
  },
});

// 导出 actions 和 reducer
export const { setPermissionSuccess,setRefreshPermissionFlag} = permissionSlice.actions;
export default permissionSlice.reducer;
