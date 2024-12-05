// src/utils/ErrorMap.js

class ErrorMap {
    constructor() {
      this.errorMap = new Map();
  
      // エラー定義を初期化
      this.initializeErrorMap();
    }
  
    // エラー定義の初期化
    initializeErrorMap() {
      // Local タイプのエラー
      this.errorMap.set('USER_NOT_FOUND', {
        errorMessage: 'ユーザーが見つかりませんでした。',
        showType: 'local',
      });
      this.errorMap.set('USER_ALREADY_ACTIVE', {
        errorMessage: 'ユーザーはすでに有効化されています。',
        showType: 'local',
      });
      this.errorMap.set('PASSWORD_MISMATCH', {
        errorMessage: 'パスワードが一致しません。',
        showType: 'local',
      });
      this.errorMap.set('ACCOUNT_INVALID', {
        errorMessage: 'アカウントが無効です。',
        showType: 'local',
      });
      this.errorMap.set('INVALID_PASSWORD', {
        errorMessage: 'パスワードが無効です。',
        showType: 'local',
      });

      this.errorMap.set('SESSION_EXPIRED', {
        errorMessage: 'セッションが無効または期限切れです。再ログインしてください。',
        showType: 'alert',
      });

      this.errorMap.set('FREE_EMAIL', {
        errorMessage: '無料のメールアドレスは使用できません。企業のメールアドレスをご利用ください。',
        showType: 'local',
      });
      this.errorMap.set('INVALID_INPUT', {
        errorMessage: '無効な入力です。入力内容をご確認ください。',
        showType: 'local',
      });
      this.errorMap.set('INVALID_ASSOCIATION', {
        errorMessage: '関連付けが無効です。関連するフィールドをご確認ください。',
        showType: 'local',
      });
      this.errorMap.set('RESOURCE_NOT_FOUND', {
        errorMessage: 'リソースが見つかりません。URLをご確認ください。',
        showType: 'local',
      });
      this.errorMap.set('COMPANY_NOT_FOUND', {
        errorMessage: '会社が見つかりません。',
        showType: 'local',
      });
  
      // Alert タイプのエラー
      this.errorMap.set('ACCOUNT_LOCKED', {
        errorMessage: 'アカウントがロックされています。',
        showType: 'alert',
      });
      this.errorMap.set('INVALID_TOKEN', {
        errorMessage: 'トークンが無効か期限切れです。',
        showType: 'alert',
      });
      this.errorMap.set('INVALID_EMAILCONFIRM_TOKEN', {
        errorMessage: 'トークンが無効か、有効期限が切れています。再度メールをご確認ください。',
        showType: 'alert',
      });
      this.errorMap.set('TOKEN_NOT_FOUND', {
        errorMessage: '一致するトークンが見つかりません。',
        showType: 'alert',
      });
      this.errorMap.set('AUTH_HEADER_MISSING', {
        errorMessage: '認証ヘッダーが提供されていません。',
        showType: 'alert',
      });
      this.errorMap.set('PERMISSION_DENIED', {
        errorMessage: 'この操作を実行する権限がありません。',
        showType: 'alert',
      });

      this.errorMap.set('ONE_ADMIN_FAILURE', {
        errorMessage: '会社には最低一人の管理者が必要です。他のユーザーを管理者に設定してから、現在のアカウントを削除してください。',
        showType: 'alert',
      });
      this.errorMap.set('DATABASE_ERROR', {
        errorMessage: 'データベースエラーが発生しました。',
        showType: 'alert',
      });
      this.errorMap.set('GET_INIT_DATA_ERROR', {
        errorMessage: '初期化設定の取得に失敗しました。',
        showType: 'alert',
      });

      this.errorMap.set('SYSTEM_ERROR', {
        errorMessage: 'システムエラーが発生しました。再試行してください。解消しない場合は管理者にお問い合わせください。',
        showType: 'alert',
      });
  
      // Toast タイプのエラー
      this.errorMap.set('EMAIL_SEND_FAILURE', {
        errorMessage: 'メール送信に失敗しました、メールアドレスをご確認ください。',
        showType: 'toast',
      });
      this.errorMap.set('DATABASE_TIMEOUT', {
        errorMessage: 'データベースのリクエストがタイムアウトしました。しばらくしてから再試行してください。',
        showType: 'toast',
      });
      this.errorMap.set('DATABASE_CONNECTION_FAILED', {
        errorMessage: 'データベースへの接続に失敗しました。ネットワーク接続を確認してください。',
        showType: 'toast',
      });
      this.errorMap.set('CONNECTION_REFUSED', {
        errorMessage: 'サービスへの接続が拒否されました。しばらくしてから再試行してください。',
        showType: 'toast',
      });
      this.errorMap.set('ADDRESS_NOT_FOUND', {
        errorMessage: 'サービスアドレスが見つかりませんでした。ネットワークを確認するか、しばらくしてから再試行してください。',
        showType: 'toast',
      });


      // WebSocket関連のエラーメッセージ------------------------------------------------

    this.errorMap.set('CONNECTION_CLOSURE_ERROR', {
        errorMessage: '通信接続を閉じる際にエラーが発生しました。再試行してください。',
        showType: 'alert',
    });

    this.errorMap.set('CONNECTION_ERROR', {
        errorMessage: '通信中に問題が発生しました。しばらくしてから再試行してください。',
        showType: 'alert',
    });

    this.errorMap.set('RETRY_LIMIT_REACHED', {
        errorMessage: '再接続の試行回数が上限に達しました。時間を置いて再試行してください。',
        showType: 'alert',
    });

    this.errorMap.set('MESSAGE_PROCESSING_ERROR', {
        errorMessage: 'サーバーからの情報を処理中に問題が発生しました。',
        showType: 'alert',
    });

    
    this.errorMap.set('USER_ID_NOT_FOUND', {
        errorMessage: 'ユーザー情報が見つからないため、通信を開始できません。',
        showType: 'alert',
    });
    
    this.errorMap.set('CONNECTION_ALREADY_EXISTS', {
        errorMessage: '通信は既に確立されています。新しい接続は不要です。',
        showType: 'toast',
    });
    

    
    this.errorMap.set('CONNECTION_CLOSED', {
        errorMessage: '通信が切断されました。必要に応じて再接続を試みてください。',
        showType: 'alert',
    });
    

    
    this.errorMap.set('CANNOT_SEND_MESSAGE', {
        errorMessage: '現在、情報を送信できません。通信状況をご確認ください。',
        showType: 'alert',
    }); 
    this.errorMap.set('RESET_RECONNECT', {
        errorMessage: '接続が中断されましたが、再接続を試みています。',
        showType: 'toast',
    });     

    this.errorMap.set('NETWORK_DISCONNECTED', {
        errorMessage: 'ネットワークに接続されていません。接続状況をご確認ください。',
        showType: 'toast',
    });
    
}
  
    // 指定したエラーコードでエラー情報を取得
    getError(errorCode, jsName, methodName) {
      const errorConfig = this.errorMap.get(errorCode);
      if (!errorConfig){
        return null;
      }
      return {
        serverErrorCode: errorCode,
        serverErrorMessage: errorConfig.errorMessage || 'エラーが発生しました。',
        errorCode: errorCode,
        errorMessage: errorConfig.errorMessage || 'エラーが発生しました。',
        showType: errorConfig.showType || 'alert',
      };
    }
  }
  
  export default new ErrorMap();
  