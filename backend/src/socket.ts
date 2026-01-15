import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerRoomHandlers } from "./modules/room/controllers/room.controller.js";

export const setupSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Conectado: ${socket.id}`);

    registerRoomHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ Desconectado: ${socket.id}`);
    });
  });

  return io;
};
