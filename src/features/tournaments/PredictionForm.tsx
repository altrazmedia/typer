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

interface PredictionValues {
  teamAScore?: number;
  teamBScore?: number;
}

export const PredictionForm: React.FC<Props> = ({ game, prediction }) => {
  const { user } = useAuthContext();
  const {
    addOrEditPrediction: { mutate: arrOrEditPrediction },
  } = usePredictionActions(user!.uid, game.id);

  const [predictionValues, setPredictionValues] = useState<PredictionValues>({
    teamAScore: prediction?.teamAScore,
    teamBScore: prediction?.teamBScore,
  });

  const addOrEditPredictionDebounced = useMemo(() => debounce(arrOrEditPrediction, 3000), [arrOrEditPrediction]);

  useEffect(() => {
    if (prediction) {
      setPredictionValues({
        teamAScore: prediction.teamAScore,
        teamBScore: prediction.teamBScore,
      });
    }
  }, [prediction]);

  const parseValue = (value: string) => {
    const num = parseInt(value, 10);
    if (num < 0 || isNaN(num)) return;
    return num;
  };

  const isFormDisabled = useMemo(() => dayjs(game.kickoff.toDate()).isBefore(dayjs()), [game.kickoff]);

  const handlePredictionValuesChange = (key: keyof PredictionValues, value: number | undefined) => {
    setPredictionValues((state) => {
      const values = { ...state, [key]: value };
      const { teamAScore, teamBScore } = values;
      if (teamAScore !== undefined && teamBScore !== undefined) {
        addOrEditPredictionDebounced({ teamAScore, teamBScore });
      }
      return values;
    });
  };

  const onTeamAChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    handlePredictionValuesChange("teamAScore", parseValue(e.target.value));
  const onTeamBChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    handlePredictionValuesChange("teamBScore", parseValue(e.target.value));

  return (
    <div className="flex flex-col items-center">
      <div>
        <input
          className="h-full w-8 rounded-md bg-base-content px-1 text-center text-xl text-base-100"
          value={predictionValues.teamAScore?.toString() || ""}
          onChange={onTeamAChange}
          disabled={isFormDisabled}
          placeholder="?"
        />
        <span className="mx-2">-</span>
        <input
          className="h-full w-8 rounded-md bg-base-content px-1 text-center text-xl text-base-100"
          value={predictionValues.teamBScore?.toString() || ""}
          onChange={onTeamBChange}
          disabled={isFormDisabled}
          placeholder="?"
        />
      </div>
    </div>
  );
};
