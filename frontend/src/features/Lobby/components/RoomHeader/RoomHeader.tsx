import { useCopyToClipboard } from "../../../../hooks/useCopyToClipboard";
import { theme } from "../../../../styles/theme";
import RoomId from "./RoomId.tsx/RoomId";

interface Props { roomId: string; }

export const RoomHeader = ({ roomId }: Props) => {
  const { copy } = useCopyToClipboard();

  return (
    <div style={{ textAlign: "center", marginBottom: theme.spacing.m }}>
      <p
        style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSize.s,
          letterSpacing: "1px",
        }}
      >
        WAITING ROOM
      </p>
      <RoomId roomId={roomId} copy={copy}></RoomId>
    </div>
  );
};

export default RoomHeader;