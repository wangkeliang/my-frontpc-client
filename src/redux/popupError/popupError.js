// src/redux/error/errorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const popupErrorSlice = createSlice({
  name: 'popupError',
  initialState: {
    popupError: null, // 存储错误对象
    showPopupFlag: false, // 控制错误提示的显示状态
  },
  reducers: {
    setPopupError: (state, action) => {
        
      state.popupError = action.payload;
      state.showPopupFlag = true;
    //   alert(`redux setError state.showError begin: ${state.showError}`);

    },
    clearPopupError: (state) => {

      state.popupError = null;
      state.showPopupFlag = false;
    //   alert(`redux clearError state.showError begin: ${state.showError}`);

    },
  },
});

export const { setPopupError, clearPopupError } = popupErrorSlice.actions;
export default popupErrorSlice.reducer;
