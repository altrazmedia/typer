import dayjs from "dayjs";
import { PredictionForm } from "./PredictionForm";
import { Game, Prediction } from "./types";

interface Props {
  game: Game;
  prediction?: Prediction;
}

export const GameCard: React.FC<Props> = ({ game, prediction }) => {
  const isUpcomingGame = dayjs(game.kickoff.toDate()).isAfter(dayjs());

  return (
    <div className="not-prose card-compact card mb-4 w-full bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex flex-row justify-center">
          <div className="flex-1 text-right">
            <h2 className="card-title justify-end">{game.teamA}</h2>
          </div>
          <div className="mx-2 flex-shrink-0">
            {isUpcomingGame ? (
              <PredictionForm game={game} prediction={prediction} />
            ) : (
              <h2 className="card-title">
                {game.teamAScore} - {game.teamBScore}
              </h2>
            )}
          </div>
          <div className="flex-1">
            <h2 className="card-title">{game.teamB}</h2>
          </div>
        </div>
        <span className="mx-auto mt-2 text-sm">{dayjs(game.kickoff.toDate()).format("DD.MM.YYYY, HH:mm")}</span>
      </div>
    </div>
  );
};
