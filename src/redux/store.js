import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createIndexedDBStorage from './indexedDBStorage'; // 引入 IndexedDB 存储

import authSlice from './auth/authSlice';
import userSlice from './user/userSlice';
import masterSlice from './master/masterSlice';
import applicationSlice from './application/applicationSlice';
import companySlice from './company/companySlice';
import caseReducer from './case/caseSlice';
import candidateReducer from './candidate/candidateSlice';
import tabReducer from './mainLayout/tabSlice';
import initialSetupReducer from './initialSetupSlice/initialSetupSlice';
import registerReducer from './auth/registerSlice';
import permissionReducer from './permission/permissionSlice';
import popupErrorReducer from './popupError/popupError';
import popupInfoSlice from './popupInfoSlice/popupInfoSlice';
import loadingSlice from './loading/loadingSlice.js';
import planDetailSlice from './planDetail/planDetailSlice';
import planHistorySlice from './planHistory/planHistorySlice';
import planSelectSlice from './planSelect/planSelectSlice';
import accountNavigateSlice from './accountNavigate/accountNavigateSlice';
import planPurchaseSlice from './planPurchase/planPurchaseSlice';
import finCodeSlice from './finCode/finCodeSlice';



// 配置 redux-persist
const persistConfig = {
  key: 'root',
  storage: createIndexedDBStorage('starSkyIndexDb'), // 使用 IndexedDB 存储
  whitelist: ['auth', 'register', 'initialSetup', 'permissions', 'user', 'tab', 'company', 'application', 'master','planDetail','planHistory','planSelect','accountNavigate','planPurchase','finCode'], // 只持久化部分 reducers
};

const rootReducer = (state, action) => {
  if (action.type === 'root/clearAllStates') {
    // 清空持久化存储
    const storage = createIndexedDBStorage('starSkyIndexDb');
    console.log('****storage.clear is called');
    storage.clear();
    state = undefined; // 将 Redux 状态重置为 undefined
  }
  return combineReducers({
    auth: authSlice,
    case: caseReducer,
    candidate: candidateReducer,
    tab: tabReducer,
    register: registerReducer,
    initialSetup: initialSetupReducer,
    permissions: permissionReducer,
    user: userSlice,
    company: companySlice,
    application: applicationSlice,
    master: masterSlice,
    popupError: popupErrorReducer,
    popupInfo: popupInfoSlice,
    loading: loadingSlice,
    planDetail:planDetailSlice,
    planHistory:planHistorySlice,
    planSelect:planSelectSlice,
    accountNavigate:accountNavigateSlice,
    planPurchase:planPurchaseSlice,
    finCode:finCodeSlice
  })(state, action);
};

// 包装 rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建 Redux Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 关闭序列化检查，因为 redux-persist 会存储非序列化数据
    }),
});

// 持久化存储
export const persistor = persistStore(store);
export default store;
