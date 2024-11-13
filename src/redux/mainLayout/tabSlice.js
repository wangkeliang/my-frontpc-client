// src/redux/slices/tabSlice.js
import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
  name: 'tab',
  initialState: 'Home', // 默认标签为 'Home'
  reducers: {
    setActiveTab: (state, action) => action.payload, // 设置激活标签
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
