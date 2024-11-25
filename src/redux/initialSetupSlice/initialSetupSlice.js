import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/ApiService';


// 异步操作：从后端获取用户和公司信息，使用 POST 方法
export const fetchInitialSetupData = createAsyncThunk(
  'initialSetup/fetchInitialSetupData',
  async (requestData = {}, { rejectWithValue }) => {
    try {
      const response = await authApi.post('/init/initial-setup-data', requestData);
      console.log('**initialSetup is called', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const initialSetupSlice = createSlice({
  name: 'initialSetup',
  initialState: {
    currentStep: 0,
    showModal: false,
    steps: [],
    isLoading: false,
    error: null,
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
        state.error = null;
      })
      .addCase(fetchInitialSetupData.fulfilled, (state, action) => {
        state.isLoading = false;

        // 检查返回的 status
        if (action.payload.status === 'success') {
          const { currentStep, showModal, steps } = action.payload.data;
          state.currentStep = currentStep;
          state.showModal = showModal;
          state.steps = steps;
        } else {
            state.isLoading = false;
            state.error = action.payload.error.message || 'Something went wrong';      
        }
        // 调试日志
        console.log('Fetched data:', action.payload);
      })
      .addCase(fetchInitialSetupData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Something went wrong';        
      });
  },
});

export const { setCurrentStep } = initialSetupSlice.actions;
export default initialSetupSlice.reducer;
