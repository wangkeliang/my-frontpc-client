// GlobalUIError.js
export class GlobalUIError extends Error {
    constructor({ error, errorCode = 'GlobalUI', errorMessage = '申し訳ございませんが、システムに問題が発生しました。しばらくしてから再度お試しください。', showType = 'replaceUi' }) {
      super(errorMessage);
      this.name = 'GlobalUIError';
      this.error = error; // 原始错误信息
      this.errorCode = errorCode; // 错误代码
      this.errorMessage = errorMessage; // 错误信息
      this.showType = showType; // 展示类型
    }
  }
  