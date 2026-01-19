import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import { Card } from "../../components/Card/Card";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { theme } from "../../styles/theme";
import VotingResultsCard from "./VotingResultsCard/VotingResultsCard";

const ResultsScreen = () => {
  const { room, me, resetGame, leaveRoom } = useGame();

  if (!room || !room.gameResults)
    return (
      <PageContainer>
        <div>Calculating results...</div>
      </PageContainer>
    );

  const { winner, impostorId, votes } = room.gameResults;

  const impostorWon = winner === "IMPOSTOR";
  const iWon =
    (impostorWon && me?.isImpostor) || (!impostorWon && !me?.isImpostor);
  const impostorName =
    room.players.find((p) => p.id === impostorId)?.name || "Unknown";

  const resultColor = impostorWon
    ? theme.colors.secondary
    : theme.colors.primary;

  const pageBackground = `radial-gradient(circle at center, ${resultColor}40 0%, #000000 100%)`;

  return (
    <PageContainer>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: pageBackground,
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", marginBottom: theme.spacing.l }}>
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "10px",
            animation: "bounce 1s",
          }}
        >
          {impostorWon ? "😈" : "🕵️‍♂️"}
        </div>
        <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }`}</style>

        <h1
          style={{
            fontSize: "2.5rem",
            margin: 0,
            color: resultColor,
            textTransform: "uppercase",
            textShadow: `0 0 20px ${resultColor}60`,
          }}
        >
          {impostorWon ? "IMPOSTOR VICTORY" : "THE INNOCENTS WON"}
        </h1>

        <h2
          style={{
            marginTop: theme.spacing.s,
            color: iWon
              ? theme.colors.text.primary
              : theme.colors.text.secondary,
            fontSize: theme.fontSize.l,
          }}
        >
          {iWon ? "🏆 YOU WON" : "☠️ YOU LOST..."}
        </h2>
      </div>

      <Card
        style={{
          textAlign: "center",
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <p
          style={{
            margin: 0,
            color: theme.colors.text.secondary,
            fontSize: theme.fontSize.s,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          THE IMPOSTOR WAS
        </p>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: theme.colors.text.primary,
            marginTop: theme.spacing.s,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              background: theme.colors.secondary,
              color: "#fff",
              padding: "5px 15px",
              borderRadius: "8px",
              fontSize: "1.5rem",
            }}
          >
            {impostorName}
          </span>
        </div>
      </Card>

      <VotingResultsCard
        room={room}
        votes={votes}
        impostorId={impostorId}
      ></VotingResultsCard>

      <div
        style={{
          display: "flex",
          gap: theme.spacing.m,
          marginTop: theme.spacing.l,
          justifyContent: "center",
        }}
      >
        <PrimaryButton
          variant="secondary"
          onClick={leaveRoom}
          style={{
            background: "transparent",
            border: `1px solid ${theme.colors.secondary}`,
            color: theme.colors.secondary,
          }}
        >
          LEAVE ❌
        </PrimaryButton>

        {me?.isHost && (
          <PrimaryButton
            onClick={resetGame}
            style={{
              background: "white",
              color: "black",
              boxShadow: "0 0 15px rgba(255,255,255,0.3)",
            }}
          >
            PLAY AGAIN 🔄
          </PrimaryButton>
        )}
      </div>
    </PageContainer>
  );
};

export default ResultsScreen;