// src/services/webSocketClient.js
import store from '../redux/store'; // 导入 Redux store
import { setWebSocketSuccess } from '../redux/auth/authSlice'; // 导入 action
import ErrorMap from '../utils/ErrorMap';
import { GlobalPopupError } from '../utils/GlobalPopupError';
import { setPopupError } from '../redux/popupError/popupError';
class WebSocketClient {
  constructor() {
    if (!WebSocketClient.instance) {
      this.socket = null;
      this.url = process.env.REACT_APP_GATEWAYAPI_URL;
      WebSocketClient.instance = this;
    }
    return WebSocketClient.instance;
  }
  // 初始化 WebSocket 连接
  connect() {
    console.log('***websocketclient.connect');
    const state = store.getState();
    let { userId, deviceId } = state.auth;
    if (!userId){
      return;
    }
    const fullUrl = `${this.url}?userId=${userId}&deviceId=${deviceId}`;
    console.log('***fullUrl=', fullUrl);

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket 已存在，跳过连接');
      return;
    }


    this.socket = new WebSocket(fullUrl);

    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
    this.socket.onclose = this.handleClose;
    this.socket.onerror = this.handleError;

      // 确保在页面关闭或刷新时关闭 WebSocket
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    console.log('**connect completed');
  }

  handleOpen = () => {
    store.dispatch(setWebSocketSuccess(true)); // 更新 Redux 状态为成功
    console.log('WebSocket 连接已打开');
    
  };

  handleBeforeUnload() {
    console.log('页面刷新或关闭，关闭 WebSocket 并更新状态');
    this.close(); // 关闭 WebSocket 连接
    store.dispatch(setWebSocketSuccess(false)); // 更新 Redux 状态为断开
  }

  handleMessage = (event) => {
    console.log('来自服务器的消息:', event.data);
    const state = store.getState();
    let { userId, deviceId } = state.auth;
  
    try {
      const message = JSON.parse(event.data); // 解析 JSON 格式的消息
  
      // 检查消息类型和代码
      if (message.messageCode === 'heartbeat') {
        console.log('收到 HEARTBEAT 消息');
      } else if (message.messageCode === 'reset') {
        console.log('收到 RESET 消息，重新建立通信连接');
        this.close(); // 关闭当前连接
        this.connect(); // 重新建立连接
      } else {
        console.warn('未识别的消息类型:', message.messageCode);
      }
    } catch (error) {
      console.error('处理消息时出错:', error);
      const errorConfig = ErrorMap.getError('MESSAGE_PROCESSING_ERROR');

      store.dispatch( setPopupError(
        new GlobalPopupError({
          error, // サーバーエラー全体を保存
          ...errorConfig,
        })
      ));
      
    }
  };
  
  handleClose = () => {
    store.dispatch(setWebSocketSuccess(false)); // 更新 Redux 状态为关闭
  };

  handleError = (error) => {
    store.dispatch(setWebSocketSuccess(false)); // 更新 Redux 状态为错误
    console.error('通信エラーが発生しました:', error); 

    const errorConfig = ErrorMap.getError('CONNECTION_ERROR');
    store.dispatch( setPopupError(
      new GlobalPopupError({
        error, // サーバーエラー全体を保存
        ...errorConfig,
      })
    ));

      
  };

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket 未打开，无法发送消息');
    }
  }

  close() {
    if (this.socket) {
        this.socket.close(); // 关闭 WebSocket 连接
        this.socket = null; // 将 socket 设为 null，以便下次可以重新建立连接
        console.log('通信连接已手动关闭');     
    }
  }
  ensureConnected() { 
    return new Promise((resolve, reject) => {
      const MAX_RETRIES = 3; // 最大重试次数
      const RETRY_INTERVAL = 3000; // 重试间隔时间（30秒）
      let retryCount = 0;
  
      const tryConnect = () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          console.log('检查结果: WebSocket 已连接');
          resolve();
          return;
        }
  
        if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
          console.log('检查结果: WebSocket 正在连接');
          const checkInterval = setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 10);
          return;
        }
  
        console.log('尝试连接 WebSocket...');
        this.connect();
  
        const checkConnection = setTimeout(() => {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket 已连接');
            clearTimeout(checkConnection);
            resolve();
          } else {
            console.error('WebSocket 连接失败');
            clearTimeout(checkConnection);
  
            retryCount += 1;
            if (retryCount < MAX_RETRIES) {
              console.log(`重试第 ${retryCount} 次，等待 ${RETRY_INTERVAL / 1000} 秒...`);
              setTimeout(tryConnect, RETRY_INTERVAL);
            } else {
 
              reject(new Error());
            }
          }
        }, 50); // 等待 5 秒检查连接状态
      };
  
      tryConnect();
    });
  }
  
  
  
}

const instance = new WebSocketClient();
export default instance;
