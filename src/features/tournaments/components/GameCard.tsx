import dayjs from "dayjs";
import { useState } from "react";
import { PlayedGameModal } from "./PlayedGameModal";
import { PredictionForm } from "./PredictionForm";
import { Game, Prediction } from "../types";
import { isTournamentAdmin } from "../utils";
import { useAuthContext } from "src/features/auth";
import { useTournament } from "../hooks";
import { EditGameModal } from "./EditGameModal";

interface Props {
  game: Game;
  prediction?: Prediction;
  tournamentId: string;
}

export const GameCard: React.FC<Props> = ({ game, prediction, tournamentId }) => {
  const { user } = useAuthContext();
  const { data: tournament } = useTournament(tournamentId);

  const [isBetsModalOpen, setBetsModal] = useState(false);
  const [isEditGameModalOpen, setEditGameModal] = useState(false);

  const isUpcomingGame = dayjs(game.kickoff.toDate()).isAfter(dayjs());

  const handleOpenBetsClick = () => {
    if (!isUpcomingGame) {
      setBetsModal(true);
    }
  };

  const handleEditGameClick = () => {
    setEditGameModal(true);
  };

  return (
    <>
      <div className={`not-prose card-compact card mb-4 w-full bg-base-200 shadow-xl`}>
        <div className="card-body">
          <span className="mx-auto text-sm">{dayjs(game.kickoff.toDate()).format("DD.MM.YYYY, HH:mm")}</span>

          <div className="flex flex-col justify-center md:flex-row">
            <div className="flex-1">
              <h2 className="card-title justify-center md:justify-end">{game.teamA}</h2>
            </div>
            <div className="mx-2 my-1 flex-shrink-0 md:my-0">
              {isUpcomingGame ? (
                <PredictionForm game={game} prediction={prediction} />
              ) : (
                <h2 className="card-title justify-center">
                  {game.teamAScore} - {game.teamBScore}
                </h2>
              )}
            </div>
            <div className="flex-1">
              <h2 className="card-title justify-center md:justify-start">{game.teamB}</h2>
            </div>
          </div>
          <div className="flex flex-row justify-center">
            {!isUpcomingGame && (
              <span className="btn-ghost btn-sm btn" onClick={handleOpenBetsClick}>
                Zobacz typy
              </span>
            )}
            {isTournamentAdmin(user!.uid, tournament!) && (
              <span className="btn-ghost btn-sm btn" onClick={handleEditGameClick}>
                Edytuj mecz
              </span>
            )}
          </div>
        </div>
      </div>
      {isBetsModalOpen && <PlayedGameModal close={() => setBetsModal(false)} game={game} />}
      {isEditGameModalOpen && (
        <EditGameModal close={() => setEditGameModal(false)} game={game} tournamentId={tournamentId} />
      )}
    </>
  );
};
