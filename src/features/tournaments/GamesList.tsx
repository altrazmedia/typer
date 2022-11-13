import dayjs from "dayjs";

import { Spinner } from "src/features/ui";

import { useTournamentGames } from "./queries";
import type { GamesListType } from "./types";

interface Props {
  tournamentId: string;
  listType: GamesListType;
}

export const GamesList: React.FC<Props> = ({ tournamentId, listType }) => {
  const { data, isLoading } = useTournamentGames(tournamentId, listType);

  return (
    <>
      {isLoading && <Spinner />}
      {data?.map((game) => (
        <div className="not-prose card card-compact mb-4 w-full bg-base-200 shadow-xl" key={game.id}>
          <div className="card-body">
            <h2 className="card-title">
              {game.teamA} {game.teamAScore ?? ""} - {game.teamBScore ?? ""} {game.teamB}
            </h2>
            <span>{dayjs(game.kickoff.toDate()).format("DD.MM.YYYY, HH:mm")}</span>
          </div>
        </div>
      ))}
      {!isLoading && !data?.length && (
        <h2 className="text-center">
          {listType === "past" ? "Nie ma jeszcze żadnych wyników" : "W tym turnieju nie ma zaplanowanych więcej meczów"}
        </h2>
      )}
    </>
  );
};
