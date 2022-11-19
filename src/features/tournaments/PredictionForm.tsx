import dayjs from "dayjs";
import debounce from "debounce";
import { ChangeEventHandler, useEffect, useMemo, useState } from "react";

import { useAuthContext } from "../auth";
import { usePredictionActions } from "./queries";

import type { Game, Prediction } from "./types";

interface Props {
  game: Game;
  prediction?: Prediction;
}

export const PredictionForm: React.FC<Props> = ({ game, prediction }) => {
  const { user } = useAuthContext();
  const {
    addPredictionMutation: { mutate: addPrediction },
    editPredictionMutation: { mutate: editPrediction },
  } = usePredictionActions(user!.uid, game.id);

  const [teamAScore, setTeamAScore] = useState<number | undefined>(prediction?.teamAScore);
  const [teamBScore, setTeamBScore] = useState<number | undefined>(prediction?.teamBScore);

  const addPredictionDebounced = useMemo(() => debounce(addPrediction, 3000), [addPrediction]);
  const editPredictionDebounced = useMemo(() => debounce(editPrediction, 3000), [editPrediction]);

  useEffect(() => {
    if (
      teamAScore !== undefined &&
      teamBScore !== undefined &&
      (teamAScore !== prediction?.teamAScore || teamBScore !== prediction?.teamBScore)
    ) {
      if (prediction) {
        editPredictionDebounced({ teamAScore, teamBScore, id: prediction.id });
      } else {
        addPredictionDebounced({ teamAScore, teamBScore });
      }
    }
  }, [teamAScore, teamBScore, prediction, addPredictionDebounced, editPredictionDebounced]);

  useEffect(() => {
    if (prediction) {
      setTeamAScore(prediction.teamAScore);
      setTeamBScore(prediction.teamBScore);
    }
  }, [prediction]);

  const parseValue = (value: string) => {
    const num = parseInt(value, 10);
    if (num < 0 || isNaN(num)) return;
    return num;
  };

  const isFormDisabled = useMemo(() => dayjs(game.kickoff.toDate()).isBefore(dayjs()), [game.kickoff]);

  const onTeamAChange: ChangeEventHandler<HTMLInputElement> = (e) => setTeamAScore(parseValue(e.target.value));
  const onTeamBChange: ChangeEventHandler<HTMLInputElement> = (e) => setTeamBScore(parseValue(e.target.value));

  return (
    <div className="flex flex-col items-center">
      <div>
        <input
          className="h-full w-8 rounded-md bg-base-content px-1 text-center text-xl text-base-100"
          value={teamAScore?.toString() || ""}
          onChange={onTeamAChange}
          disabled={isFormDisabled}
          placeholder="?"
        />
        <span className="mx-2">-</span>
        <input
          className="h-full w-8 rounded-md bg-base-content px-1 text-center text-xl text-base-100"
          value={teamBScore?.toString() || ""}
          onChange={onTeamBChange}
          disabled={isFormDisabled}
          placeholder="?"
        />
      </div>
    </div>
  );
};
