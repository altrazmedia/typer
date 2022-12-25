import { useParams } from "react-router-dom";

import { Modal, Spinner } from "src/features/ui";

import { PredictionStatus } from "./PredictionStatus";
import { useGamePredictions, useTournamentMembers } from "../hooks/queries";
import { Game } from "../types";

interface Props {
  game: Game;
  close(): void;
}

export const PlayedGameModal: React.FC<Props> = ({ game, close }) => {
  const { id: tournamentId } = useParams();
  const { isLoading: membersLoading, findMemberName } = useTournamentMembers(tournamentId!);
  const { data: predictions, isLoading: predictionsLoading, isError } = useGamePredictions(game.id);

  const isLoading = membersLoading || predictionsLoading;

  return (
    <Modal close={close}>
      <div style={{ width: "85vw", maxWidth: "800px" }} className="prose">
        <h1 className="text-center">
          {game.teamA} {game.teamAScore} - {game.teamBScore} {game.teamB}
        </h1>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>Nie udało się pobrać informacji o typach na ten mecz</span>
            </div>
          </div>
        ) : !predictions?.length ? (
          <p className="text-center">Nikt nie typował wyniku tego meczu</p>
        ) : (
          <>
            <h3>Typy zawodników</h3>
            <div className="overflow-x-auto">
              <table className="mt-0 mb-0 table w-full">
                <tbody>
                  {predictions?.map((prediction) => (
                    <tr key={prediction.id}>
                      <td>{findMemberName(prediction.uid)}</td>
                      <td>
                        {prediction.teamAScore} - {prediction.teamBScore}
                      </td>
                      <td>
                        <PredictionStatus
                          teamAPrediction={prediction.teamAScore}
                          teamBPrediction={prediction.teamBScore}
                          teamAScore={game.teamAScore}
                          teamBScore={game.teamBScore}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
