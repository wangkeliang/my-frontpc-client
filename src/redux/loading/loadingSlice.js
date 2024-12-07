import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isGlobalLoading: false, // 全局加载状态
  },
  reducers: {
    showGlobalLoading: (state) => {
      state.isGlobalLoading = true;
    },
    hideGlobalLoading: (state) => {
      state.isGlobalLoading = false;
    },
  },
});

export const { showGlobalLoading, hideGlobalLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
