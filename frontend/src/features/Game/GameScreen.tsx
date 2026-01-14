import { useGame } from "../../context/GameContext";

export default function GameScreen() {
  const { gameState, room } = useGame();

  return (
    <div>
      <h1>Game Screen</h1>
      <p>Current Game State: {gameState}</p>
      <p>Room ID: {room ? room.id : "No room joined"}</p>
    </div>
  );
}
