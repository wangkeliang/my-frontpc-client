// src/services/ErrorLoggerService.js

const ErrorLoggerService = {
    logErrorToConsole(error, errorInfo) {
      console.error("捕获的错误:", error);
      console.error("错误信息:", errorInfo);
    },
  
    logErrorToExternalService(error, errorInfo) {
      console.error("捕获的错误:", error);
      console.error("错误信息:", errorInfo);
    //   // 假设将日志发送到外部监控服务
    //   const errorPayload = {
    //     message: error.message,
    //     stack: error.stack,
    //     componentStack: errorInfo.componentStack,
    //     timestamp: new Date().toISOString(),
    //   };
  
    //   fetch(process.env.REACT_APP_ERROR_LOGGING_API, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(errorPayload),
    //   }).catch((e) => {
    //     console.error("日志发送失败:", e);
    //   });
    },
  
    logError(error, errorInfo) {
      // 根据环境区分日志处理方式
      if (process.env.REACT_APP_ENV === "development") {
        this.logErrorToConsole(error, errorInfo);
      } else {
        this.logErrorToConsole(error, errorInfo);
        // this.logErrorToExternalService(error, errorInfo);
      }
    },
  };
  
  export default ErrorLoggerService;
  