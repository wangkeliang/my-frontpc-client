import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; // 使用 sessionStorage
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
// 配置 redux-persist
const persistConfig = {
  key: 'root',
  storage: storageSession, // 使用 sessionStorage
  whitelist: ['auth', 'register', 'initialSetup', 'permissions', 'user', 'tab', 'company','application','master'], // 只持久化部分 reducers
};

const rootReducer = (state, action) => {
  if (action.type === 'root/clearAllStates') {
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
    popupInfo:popupInfoSlice,
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
