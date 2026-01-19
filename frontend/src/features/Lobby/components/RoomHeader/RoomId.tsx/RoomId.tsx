import { theme } from "../../../../../styles/theme";

interface Props {
  roomId: string;
  copy: (text: string) => void;
}

const RoomId = ({ roomId, copy }: Props) => {
  return (
    <div
      onClick={() => copy(roomId)}
      style={{
        background: "rgba(255,255,255,0.05)",
        border: `2px dashed ${theme.colors.border}`,
        borderRadius: theme.borderRadius.l,
        padding: `${theme.spacing.s} ${theme.spacing.l}`,
        cursor: "pointer",
        display: "inline-block",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "3rem",
          color: theme.colors.primary,
          fontFamily: "monospace",
        }}
      >
        {roomId}
      </h1>
      <span style={{ fontSize: "10px", color: theme.colors.text.secondary }}>
        CLICK TO COPY
      </span>
    </div>
  );
};
export default RoomId;
