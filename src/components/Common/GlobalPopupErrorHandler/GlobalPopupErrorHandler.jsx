import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearPopupError } from '../../../redux/popupError/popupError';
import Toast from '../Toast/Toast'; // 使用之前的 Toast 组件
import AlertModal from '../AlertModal/AlertModal'; // 假设你有 AlertModal 组件

const GlobalPopupErrorHandler = () => {
  const { popupError, showPopupFlag } = useSelector((state) => state.popupError);
  const dispatch = useDispatch();

  // 本地状态，用于控制 Toast 或 Alert 的显示
  const [globalError, setGlobalError] = useState(null);
  const [globalShowError, setGlobalShowError] = useState(false);

  // 在 Redux 状态变化时处理错误
  useEffect(() => {
    if (showPopupFlag && popupError) {
      console.log('Popup Error occurred:', popupError);
      setGlobalError(popupError); // 保存错误信息到本地状态
      setGlobalShowError(true); // 控制 Toast 或 Alert 显示
    }
  }, [showPopupFlag, popupError]);

  // Toast 或 Alert 关闭时的回调
  const handleClose = () => {
    setGlobalShowError(false); // 关闭本地状态
    dispatch(clearPopupError()); // 清除 Redux 状态中的错误
  };

  // 根据 showType 判断显示 Toast 或 Alert
  if (!globalShowError || !globalError) {
    return null;
  }

  console.log('***globalPopupError', globalError);
  if (globalError.showType === 'alert') {
    return (
      <AlertModal
        open={globalShowError}
        title="エラーが発生しました"
        message={globalError?.errorMessage || '不明なエラーが発生しました。'}
        severity="error"
        confirmText="再試行"
        onConfirm={handleClose}
      />
    );
  }

  return (
    <Toast
      open={globalShowError}
      message={globalError?.errorMessage || '不明なエラーが発生しました。'}
      severity="error"
      duration={5000}
      onClose={handleClose}
      vertical="top"
      horizontal="center"
    />
  );
};

export default GlobalPopupErrorHandler;
