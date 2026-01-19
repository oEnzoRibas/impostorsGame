import type { Room } from "@jdi/shared";
import { Card } from "../../../components/Card/Card";
import { theme } from "../../../styles/theme";
import ResultsPlayerList from "../ResultsPlayerList/ResultsPlayerList";

interface Props {
  room: Room;
  votes: Record<string, string>;
  impostorId: string;
}

const VotingResultsCard = ({ room, votes, impostorId }: Props) => {
  return (
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
        VOTING RESULTS
      </h3>

      <ResultsPlayerList
        room={room}
        votes={votes}
        impostorId={impostorId}
      ></ResultsPlayerList>
    </Card>
  );
};

export default VotingResultsCard;
