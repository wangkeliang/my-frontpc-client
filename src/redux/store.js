// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import caseReducer from './case/caseSlice';
import candidateReducer from './candidate/candidateSlice';
import tabReducer from './mainLayout/tabSlice';
import initialSetupReducer from './initialSetupSlice/initialSetupSlice';
import registerReducer from './auth/registerSlice'; // 引入 registerSlice
import permissionReducer from './permission/permissionSlice'; // 引入 permissionSlice

const store = configureStore({
  reducer: {
    auth: authSlice,
    case: caseReducer,
    candidate: candidateReducer,
    tab: tabReducer,
    register: registerReducer, // 添加 register 到 reducer 对象
    initialSetup: initialSetupReducer,
    permissions: permissionReducer, // 添加 permissions 到 reducer 对象
  },
});

export default store;
