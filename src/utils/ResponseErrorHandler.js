// src/utils/ResponseErrorHandler.js

import ErrorMap from './ErrorMap';
import { GlobalPopupError } from './GlobalPopupError';
import { LocalError } from './LocalError';

/**
 * サーバーのレスポンスを統一的に処理する
 * @param {Object} response - サーバーからのレスポンスオブジェクト
 * @param {Function} onLocalError - ローカルエラーを処理するコールバック関数
 * @param {Function} onGlobalError - グローバルエラーを処理するコールバック関数
 */
export const ResponseErrorHandler = (response, onLocalError, onGlobalError) => {
  console.log('****ResponseErrorHandler is begin');
  try {
    const serverErrorCode = response?.data?.error?.[0]?.errorCode;
    const serverErrorMessage = response?.data?.error?.[0]?.errorMessage;

    if (!serverErrorCode || !serverErrorMessage) {
      // エラーコードまたはエラーメッセージが存在しない場合、デフォルトでグローバルエラーをスロー
      const errorConfig = ErrorMap.getError('SYSTEM_ERROR');
      onGlobalError(
        new GlobalPopupError({
          error: response?.data?.error, // サーバーエラー全体を保存
          ...errorConfig,
        })
      );
      return;
    }

    // エラーコードに基づいてマッピングから設定を取得
    const errorConfig = ErrorMap.getError(serverErrorCode);

    const errorDetail = {
      error: response?.data?.error, // サーバーエラー全体を保存
      ...errorConfig,
    };
    console.log('****errorDetail=',errorDetail);

    if (errorDetail.showType === 'local') {
      console.log('***errorDetail.showType=',errorDetail.showType);
      onLocalError(
        new LocalError({
          ...errorDetail,
        })
      );
    } else {
      console.log('***errorDetail.showType=',errorDetail.showType);
      onGlobalError(
        new GlobalPopupError({
          ...errorDetail,
        })
      );
    }
  } catch (error) {
    // 内部エラーをキャッチしてグローバルエラーをスロー
    const errorConfig = ErrorMap.getError('SYSTEM_ERROR');
    onGlobalError(
      new GlobalPopupError({
        error, // サーバーエラー全体を保存
        ...errorConfig,
      })
    );
  }
};