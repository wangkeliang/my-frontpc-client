// src/redux/case/caseSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cases: [],
  selectedCase: null,
  loading: false,
  error: null,
};

const caseSlice = createSlice({
  name: 'case',
  initialState,
  reducers: {
    fetchCasesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCasesSuccess: (state, action) => {
      state.cases = action.payload;
      state.loading = false;
    },
    fetchCasesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectCase: (state, action) => {
      state.selectedCase = action.payload;
    },
  },
});

export const { fetchCasesRequest, fetchCasesSuccess, fetchCasesFailure, selectCase } = caseSlice.actions;

export default caseSlice.reducer;
