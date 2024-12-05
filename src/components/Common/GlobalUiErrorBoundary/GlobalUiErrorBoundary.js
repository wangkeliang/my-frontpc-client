import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorLoggerService from '../ErrorLoggerService/ErrorLoggerService';
import SystemErrorPage from '../../../pages/SystemErrorPage/SystemErrorPage';

const GlobalUiErrorBoundary = ({ children }) => {
  const handleError = (error, errorInfo) => {
    // 调用日志记录服务
    ErrorLoggerService.logError(error, errorInfo);
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallbackRender={() => (
        // 直接渲染 SystemErrorPage，不提供 resetErrorBoundary
        <SystemErrorPage />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalUiErrorBoundary;
