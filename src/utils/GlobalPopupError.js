// GlobalPopupError.js
export class GlobalPopupError extends Error {
    constructor({ error, errorCode = 'SYSTEM_ERROR', errorMessage = 'システムエラーが発生しました。再試行してください。', showType = 'alert' }) {
      super(errorMessage);
      this.name = 'GlobalPopupError';
      this.error = error; // 原始错误信息
      this.errorCode = errorCode; // 错误代码
      this.errorMessage = errorMessage; // 错误信息
      this.showType = showType; // 展示类型
    }
  }
  