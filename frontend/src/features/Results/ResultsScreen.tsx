import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import { Card } from "../../components/Card/Card";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { theme } from "../../styles/theme";

const ResultsScreen = () => {
  const { room, me, resetGame, leaveRoom } = useGame();

  if (!room || !room.gameResults)
    return (
      <PageContainer>
        <div>Calculando resultados...</div>
      </PageContainer>
    );

  const { winner, impostorId, votes } = room.gameResults;

  // Lógica de Vitória/Derrota
  const impostorWon = winner === "IMPOSTOR";
  const iWon =
    (impostorWon && me?.isImpostor) || (!impostorWon && !me?.isImpostor);
  const impostorName =
    room.players.find((p) => p.id === impostorId)?.name || "Desconhecido";

  // Define cores baseadas no resultado
  const resultColor = impostorWon
    ? theme.colors.secondary
    : theme.colors.primary;

  // Fundo dinâmico: Vermelho se Impostor ganhou, Verde se Inocentes ganharam
  const pageBackground = `radial-gradient(circle at center, ${resultColor}40 0%, #000000 100%)`;

  return (
    <PageContainer>
      {/* Sobrescrevemos o fundo do container via style inline para dar o clima do resultado */}
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

      {/* CABEÇALHO DE RESULTADO */}
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
          {impostorWon ? "VITÓRIA DO IMPOSTOR" : "OS INOCENTES VENCERAM"}
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
          {iWon ? "🏆 Parabéns, você venceu!" : "☠️ Você perdeu..."}
        </h2>
      </div>

      {/* REVELAÇÃO DO IMPOSTOR */}
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
          O IMPOSTOR ERA
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

      {/* LISTA DE VOTOS */}
      <Card>
        <h3
          style={{
            marginTop: 0,
            marginBottom: theme.spacing.m,
            color: theme.colors.text.primary,
            borderBottom: `1px solid ${theme.colors.border}`,
            paddingBottom: "10px",
          }}
        >
          RESULTADO DA VOTAÇÃO
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {room.players.map((player) => {
            const votedTargetId = votes[player.id];
            const votedTargetName =
              room.players.find((p) => p.id === votedTargetId)?.name ||
              "Ninguém (Absteve)";

            // Se votou no impostor = Verde, Se errou = Vermelho
            const isCorrectVote = votedTargetId === impostorId;
            const voteColor = isCorrectVote
              ? theme.colors.primary
              : theme.colors.secondary;

            return (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: theme.borderRadius.m,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {/* Ícone pequeno do votante */}
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#444",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "10px",
                    }}
                  >
                    {player.name.charAt(0)}
                  </div>
                  <span>{player.name}</span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      color: theme.colors.text.disabled,
                      fontSize: "12px",
                    }}
                  >
                    votou em ➝
                  </span>
                  <span
                    style={{
                      color: voteColor,
                      fontWeight: "bold",
                      border: `1px solid ${voteColor}`,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {votedTargetName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* BOTÕES DE AÇÃO */}
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
          SAIR ❌
        </PrimaryButton>

        {me?.isHost && (
          <PrimaryButton
            onClick={resetGame} // ✅ Usando resetGame para manter a sala
            style={{
              background: "white",
              color: "black",
              boxShadow: "0 0 15px rgba(255,255,255,0.3)",
            }}
          >
            JOGAR NOVAMENTE 🔄
          </PrimaryButton>
        )}
      </div>
    </PageContainer>
  );
};

export default ResultsScreen;