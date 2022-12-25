import dayjs from "dayjs";
import { useState } from "react";
import { PlayedGameModal } from "./PlayedGameModal";
import { PredictionForm } from "./PredictionForm";
import { Game, Prediction } from "../types";

interface Props {
  game: Game;
  prediction?: Prediction;
}

export const GameCard: React.FC<Props> = ({ game, prediction }) => {
  const [isModalOpen, setModal] = useState(false);
  const isUpcomingGame = dayjs(game.kickoff.toDate()).isAfter(dayjs());

  const handleCardClick = () => {
    if (!isUpcomingGame) {
      setModal(true);
    }
  };

  return (
    <>
      <div
        className={`not-prose card card-compact mb-4 w-full bg-base-200 shadow-xl ${
          isUpcomingGame ? "" : "cursor-pointer"
        }`}
        onClick={handleCardClick}
      >
        <div className="card-body">
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
          <span className="mx-auto mt-2 text-sm">{dayjs(game.kickoff.toDate()).format("DD.MM.YYYY, HH:mm")}</span>
        </div>
      </div>
      {isModalOpen && <PlayedGameModal close={() => setModal(false)} game={game} />}
    </>
  );
};
