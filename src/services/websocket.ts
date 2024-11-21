import { API_URL } from "./config";

class WebSocketService {
  private isConnected: boolean = false;

  connect(userId: string, userType: string) {
    this.isConnected = true;
    console.log('Mock WebSocket connected');
  }

  disconnect() {
    this.isConnected = false;
    console.log('Mock WebSocket disconnected');
  }

  addListener(event: string, callback: Function) {
    // Mock implementation for POC
  }

  removeListener(event: string, callback: Function) {
    // Mock implementation for POC
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const websocketService = new WebSocketService();