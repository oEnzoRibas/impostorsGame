import { randomUUID } from "crypto";
import { redisClient } from "../../../config/redis.js";
import { Room, Player } from "@jdi/shared";

export const RoomService = {
  async create(hostId: string, playerName: string): Promise<Room> {
    return {} as Room;
  },
};
