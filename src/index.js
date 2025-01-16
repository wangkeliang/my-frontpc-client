import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ErrorBoundary } from "react-error-boundary";
import GlobalUiErrorBoundary from './components/Common/GlobalUiErrorBoundary/GlobalUiErrorBoundary';
import GlobalPopupErrorHandler from './components/Common/GlobalPopupErrorHandler/GlobalPopupErrorHandler';
import GlobalPopupInfoHandler from './components/Common/GlobalPopupInfoHandler/GlobalPopupInfoHandler';
import createIndexedDBStorage from './redux/indexedDBStorage'; // 引入 IndexedDB 存储

import { useDispatch } from 'react-redux';
// 监听 beforeunload 事件
const indexedDBStorage = createIndexedDBStorage('starSkyIndexDb'); // 创建实例
window.addEventListener('beforeunload', async (event) => {
  console.log('beforeunload triggered: clearing IndexedDB');
  try {
    await indexedDBStorage.clear(); // 清空 IndexedDB 数据
    console.log('IndexedDB cleared successfully');
  } catch (error) {
    console.error('Failed to clear IndexedDB:', error);
  }  
});

const container = document.getElementById('root');
const root = createRoot(container);
console.log('**root render');
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <GlobalPopupErrorHandler />
        <GlobalPopupInfoHandler />        
        <GlobalUiErrorBoundary>          
          <App />
        </GlobalUiErrorBoundary>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
