// src/redux/popupInfoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const popupInfoSlice = createSlice({
  name: "popupInfo",
  initialState: {
    showInfoFlag: false,
    popupInfo: null, // 通知情報を格納
  },
  reducers: {
    setPopupInfo: (state, action) => {
     console.log('**redux setPopupInfo');
      state.popupInfo = action.payload;
      state.showInfoFlag = true;
    },
    clearPopupInfo: (state) => {
      state.popupInfo = null;
      state.showInfoFlag = false;
    },
  },
});

export const { setPopupInfo, clearPopupInfo } = popupInfoSlice.actions;
export default popupInfoSlice.reducer;
