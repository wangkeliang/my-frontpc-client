// src/redux/candidate/candidateSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  selectedCandidate: null,
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    fetchCandidatesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCandidatesSuccess: (state, action) => {
      state.candidates = action.payload;
      state.loading = false;
    },
    fetchCandidatesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
  },
});

export const { fetchCandidatesRequest, fetchCandidatesSuccess, fetchCandidatesFailure, selectCandidate } = candidateSlice.actions;

export default candidateSlice.reducer;
