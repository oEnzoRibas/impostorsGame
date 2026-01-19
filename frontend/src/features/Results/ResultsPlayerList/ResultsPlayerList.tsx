import type { Room } from "@jdi/shared";
import { theme } from "../../../styles/theme";

interface Props {
  room: Room;
  votes: Record<string, string>;
  impostorId: string;
}

const ResultsPlayerList = ({ room, votes, impostorId }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {room.players.map((player) => {
        const votedTargetId = votes[player.id];
        const votedTargetName =
          room.players.find((p) => p.id === votedTargetId)?.name ||
          "Ninguém (Absteve)";

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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  color: theme.colors.text.disabled,
                  fontSize: "12px",
                }}
              >
                voted for ➝
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
  );
};

export default ResultsPlayerList;
