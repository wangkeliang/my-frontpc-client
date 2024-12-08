import { GlobalPopupError } from './GlobalPopupError';
import { GlobalUIError } from './GlobalUIError';
import { LocalError } from './LocalError';
import ErrorMap from './ErrorMap';
import { setPopupError } from '../redux/popupError/popupError';
import store from '../redux/store'; // 引入 Redux Store

class ErrorHandler {
  /**
   * 处理捕获的错误
   * @param {Error} error 捕获的错误对象
   * @param {Function} setLocalErrorMethod 本地错误处理方法
   * @param {Function} showBoundaryMethod 错误边界处理方法
   * @param {string} globalErrorDoType 全局错误的处理方式（'popup' 或 'throw'）
   * @param {string} otherErrorDoType 其他错误的处理方式（'popup' 或 'throw'）
   * @param {string} otherErrorCode 默认其他错误代码
   */
  static doCatchedError(
    error,
    setLocalErrorMethod,
    showBoundaryMethod,
    globalErrorDoType = 'popup',
    otherErrorDoType = 'throw',
    otherErrorCode = 'SYSTEM_ERROR'
  ) {
    const dispatch = store.dispatch; // 从 Redux Store 获取 dispatch

    // 如果是 LocalError，调用本地错误处理方法
    if (error instanceof LocalError) {
      setLocalErrorMethod(error);
      return;
    }

    // 如果是 GlobalPopupError
    if (error instanceof GlobalPopupError) {
      if (globalErrorDoType === 'popup') {
        // 全局弹窗错误处理
        dispatch(setPopupError(error));
      } else if (globalErrorDoType === 'throw') {
        // 转换为 GlobalUIError 并抛出到错误边界
        const globalUiError = new GlobalUIError({
          error: error,
          errorCode: error.errorCode,
          errorMessage: error.errorMessage,
          showType: 'replaceUi',
        });
        showBoundaryMethod(globalUiError);
      }
      return;
    }

    // 如果不是 LocalError 或 GlobalPopupError，则处理为其他类型的错误
    const errorConfig = ErrorMap.getError(error?.errorCode) || ErrorMap.getError(otherErrorCode);

    if (otherErrorDoType === 'popup') {
      // 创建 GlobalPopupError 并显示
      const globalPopupError = new GlobalPopupError({
        error: error, // 原始错误
        ...errorConfig, // 包括错误消息和展示类型
      });
      dispatch(setPopupError(globalPopupError));
    } else if (otherErrorDoType === 'throw') {
      // 转换为 GlobalUIError 并抛出到错误边界
      const globalUiError = new GlobalUIError({
        error: error,
        errorCode: errorConfig?.errorCode || otherErrorCode,
        errorMessage: errorConfig?.errorMessage || 'システムエラーが発生しました。',
        showType: 'replaceUi',
      });
      showBoundaryMethod(globalUiError);
    }
  }
}

export default ErrorHandler;
