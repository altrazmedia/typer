import { Modal } from "src/features/ui";
import { useGameActions } from "../hooks";
import { Game } from "../types";
import { GameForm } from "./GameForm";

interface Props {
  game: Game;
  close(): void;
  tournamentId: string;
}

export const EditGameModal: React.FC<Props> = ({ game, close, tournamentId }) => {
  const { editGame } = useGameActions(tournamentId);

  const handleSubmit = (game: Game) => {
    editGame.mutate(game, {
      onSuccess: close,
    });
  };

  return (
    <Modal close={close}>
      <GameForm submit={handleSubmit} game={game} header="Edytuj mecz" />
    </Modal>
  );
};
