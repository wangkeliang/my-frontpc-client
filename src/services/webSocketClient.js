// src/services/webSocketClient.js
import store from '../redux/store'; // 导入 Redux store

let webSocketInstance = null; // 全局的 WebSocketClient 实例

class WebSocketClient {
  constructor() {
    if (webSocketInstance) {
      return webSocketInstance; // 返回现有实例
    }

    this.url = process.env.REACT_APP_GATEWAYAPI_URL; // 使用环境变量中的 URL
    this.socket = null;
    webSocketInstance = this; // 将实例赋值给全局变量
  }

  // 初始化 WebSocket 连接
  connect() {
    console.log('***websocketclient.connect');

    const state = store.getState();
    let { userId, deviceId } = state.auth;
    const fullUrl = `${this.url}?userId=${userId}&deviceId=${deviceId}`;
    console.log('***fullUrl=', fullUrl);

    this.socket = new WebSocket(fullUrl);

    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
    this.socket.onclose = this.handleClose;
    this.socket.onerror = this.handleError;
  }

  handleOpen = () => {
    console.log('WebSocket 连接已打开');
  };

  handleMessage = (event) => {
    console.log('来自服务器的消息:', event.data);
    const state = store.getState();
    let { userId, deviceId } = state.auth;
    try {
      const message = JSON.parse(event.data); // 解析 JSON 格式的消息

      // 检查消息类型和代码
      if (message.messageCode === 'HeartBeat') {
        console.log('收到 HEARTBEAT 消息');
      } else if (message.messageCode === 'Reset') {
        console.log('收到 RESET 消息，重新建立 WebSocket 连接');
        this.close(); // 关闭当前连接
        this.connect(); // 重新建立连接
      }
    } catch (error) {
      console.error('处理消息时出错:', error);
    }
  };

  handleClose = () => {
    console.log('WebSocket 连接已关闭');
  };

  handleError = (error) => {
    console.error('WebSocket 错误:', error);
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
      console.log('WebSocket 连接已手动关闭');
    }
  }
}

export default WebSocketClient;
