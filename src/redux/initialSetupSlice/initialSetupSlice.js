import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';
import { apiHandler } from '../../utils/apiHandler';

/**
 * 异步操作：从后端获取用户和公司信息，使用 POST 方法
 */
export const fetchInitialSetupData = createAsyncThunk(
  'initialSetup/fetchInitialSetupData',
  (requestData = {}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      apiHandler(
        authApi,
        '/init/initial-setup-data',
        requestData,
        'POST',
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

const initialSetupSlice = createSlice({
  name: 'initialSetup',
  initialState: {
    currentStep: 0,
    showModal: false,
    steps: [],
    isLoading: false,
  },
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    hideModal(state) {
      state.showModal = false; // 隐藏模态窗口      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialSetupData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInitialSetupData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStep = action.payload.currentStep;
        state.showModal = action.payload.showModal;          
        state.steps = action.payload.steps; 
        
        console.log('Fetched data:', action.payload);
      })
      .addCase(fetchInitialSetupData.rejected, (state, action) => {
        state.isLoading = false;      
      });
  },
});

export const { setCurrentStep } = initialSetupSlice.actions;
export default initialSetupSlice.reducer;
