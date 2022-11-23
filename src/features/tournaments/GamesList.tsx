import { Spinner } from "src/features/ui";
import { useAuthContext } from "src/features/auth";

import { GameCard } from "./GameCard";
import { useMyPredictions, useTournamentGames } from "./queries";
import type { GamesListType } from "./types";

interface Props {
  tournamentId: string;
  listType: GamesListType;
}

export const GamesList: React.FC<Props> = ({ tournamentId, listType }) => {
  const { user } = useAuthContext();
  const { data = [], isLoading: isLoadingGames } = useTournamentGames(tournamentId, listType);
  const { data: predictions = [], isLoading: isLoadingPredictions } = useMyPredictions(
    user!.uid,
    data.map((game) => game.id)
  );

  const getPrediction = (gameId: string) => {
    return predictions.find((item) => item.gameId === gameId);
  };

  const isLoading = isLoadingGames || isLoadingPredictions;

  return (
    <>
      {isLoading && <Spinner />}
      {data?.map((game) => {
        const prediction = getPrediction(game.id);
        return <GameCard game={game} prediction={prediction} key={game.id} />;
      })}
      {!isLoading && !data?.length && (
        <h2 className="text-center">
          {listType === "past" ? "Nie ma jeszcze żadnych wyników" : "W tym turnieju nie ma zaplanowanych więcej meczów"}
        </h2>
      )}
    </>
  );
};
