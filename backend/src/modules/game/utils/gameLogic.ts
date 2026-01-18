import { Room } from "@jdi/shared";

export const advanceTurn = (room: Room) => {
  if (room.players.length === 0) return;

  const currentIndex = room.players.findIndex(
    (p) => p.id === room.turnPlayerId,
  );

  let nextIndex = currentIndex + 1;
  if (nextIndex >= room.players.length) {
    nextIndex = 0;
    room.currentRound++;
  }

  room.turnPlayerId = room.players[nextIndex].id;

  if (room.currentRound > room.maxRounds) {
    room.gameState = "VOTING";
    room.turnPlayerId = "";
  }
};
