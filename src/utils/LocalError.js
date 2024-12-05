export class LocalError extends Error {
    constructor({ errorCode = 'INVALID_INPUT', errorMessage = '入力内容をご確認ください。', showType = 'local' } = {}) {
      super(errorMessage);
      this.name = 'LocalError';
      this.errorCode = errorCode; // 错误代码
      this.errorMessage = errorMessage; // 错误信息
      this.showType = showType; // 展示类型
    }
  }