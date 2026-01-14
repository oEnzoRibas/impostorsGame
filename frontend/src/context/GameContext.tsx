import {
  createContext,
  type ReactNode,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import type { GameState, Room } from "../types";
import { socketService } from "../services/socket";

interface GameContextData {
  gameState: GameState;
  room: Room | null;
  connect: () => void;
  disconnect: () => void;
  createRoom: (playerName: string) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  startGame: () => void;
  leaveRoom: () => void;
}

const GameContext = createContext({} as GameContextData);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>("LOBBY");
  const [room, setRoom] = useState<Room | null>(null);

  const connect = () => {
    const socket = socketService.connect();

    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });

    socket.on("room_update", (updatedRoom: Room) => {
      setRoom(updatedRoom);
      setGameState(updatedRoom.gameState);
    });

    return () => socketService.disconnect();
  };

  const disconnect = () => {
    socketService.disconnect();
  };

  const createRoom = (playerName: string) => {
    socketService.socket?.emit("create_room", { playerName });
  };

  const joinRoom = (roomId: string, playerName: string) => {
    socketService.socket?.emit("join_room", { roomId, playerName });
  };

  const startGame = () => {
    socketService.socket?.emit("start_game");
  };

  const leaveRoom = () => {
    socketService.socket?.emit("leave_room");
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        room,
        connect,
        disconnect,
        createRoom,
        joinRoom,
        startGame,
        leaveRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
