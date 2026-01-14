import { Socket } from "socket.io";
import { RoomService } from "../services/room.service.js";

export const roomController = (socket: Socket) => {
  socket.on("create_room", async (data) => {
    // Chama o service...
  });
};
