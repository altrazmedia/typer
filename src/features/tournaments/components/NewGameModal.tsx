import { Modal } from "src/features/ui";

import { GameForm } from "./GameForm";
import type { GameDB } from "../types";
import { useGameActions } from "../hooks";

interface Props {
  close(): void;
  tournamentId: string;
}

export const NewGameModal: React.FC<Props> = ({ close, tournamentId }) => {
  const { addGame } = useGameActions(tournamentId);

  const handleSubmit = (values: GameDB) => {
    addGame.mutate(values, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal close={close}>
      <GameForm submit={handleSubmit} header="Dodaj nowy mecz" />
    </Modal>
  );
};
