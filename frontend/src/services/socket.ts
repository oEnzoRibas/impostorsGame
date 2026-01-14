import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class SocketService {
  public socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(BACKEND_URL, {
        autoConnect: false,
        transports: ["polling", "websocket"],
      });
    }
    this.socket.connect();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
