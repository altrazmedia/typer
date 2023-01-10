import { Spinner } from "src/features/ui";
import { useAuthContext } from "src/features/auth";

import { GameCard } from "./GameCard";
import { useMyPredictions, useTournament, useTournamentGames } from "../hooks";
import type { GamesListType } from "../types";
import { isTournamentAdmin } from "../utils";
import { useState } from "react";
import { NewGameModal } from "./NewGameModal";

interface Props {
  tournamentId: string;
  listType: GamesListType;
}

export const GamesList: React.FC<Props> = ({ tournamentId, listType }) => {
  const [isNewGameModalOpen, setNewGameModal] = useState(false);

  const { user } = useAuthContext();
  const { data: tournament } = useTournament(tournamentId);
  const { data = [], isLoading: isLoadingGames } = useTournamentGames(tournamentId, listType);
  const {
    data: predictions = [],
    isLoading: isLoadingPredictions,
    fetchStatus: predictionsFetchStatus,
  } = useMyPredictions({ uid: user!.uid, gamesIds: data.map((game) => game.id), isEnabled: listType === "upcoming" });

  const getPrediction = (gameId: string) => {
    return predictions.find((item) => item.gameId === gameId);
  };

  const isLoading = isLoadingGames || (isLoadingPredictions && predictionsFetchStatus === "fetching");

  const newGameButton = isTournamentAdmin(user!.uid, tournament!) && (
    <button onClick={() => setNewGameModal(true)} className="btn-ghost btn">
      + Dodaj nowy mecz
    </button>
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-4">{newGameButton}</div>
          {data?.map((game) => {
            const prediction = getPrediction(game.id);
            return <GameCard game={game} prediction={prediction} key={game.id} tournamentId={tournamentId} />;
          })}
        </>
      )}
      {!isLoading && !data?.length && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center">
            {listType === "past"
              ? "Nie ma jeszcze żadnych wyników"
              : "W tym turnieju nie ma zaplanowanych więcej meczów"}
          </h2>
          {newGameButton}
        </div>
      )}
      {isNewGameModalOpen && <NewGameModal close={() => setNewGameModal(false)} tournamentId={tournamentId} />}
    </>
  );
};
