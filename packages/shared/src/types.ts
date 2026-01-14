export type GameState =
  | "LOBBY"
  | "WAITING"
  | "ROULETTE"
  | "PLAYING"
  | "VOTING"
  | "RESULTS"
  | "LOADING";

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isImpostor: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  gameState: GameState;
}
