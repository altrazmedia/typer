import dayjs from "dayjs";
import { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { Game, Prediction } from "./types";

export const usePredictionForm = (game: Game, prediction?: Prediction) => {
  const [teamAScore, setTeamAScore] = useState<number | undefined>(prediction?.teamAScore);
  const [teamBScore, setTeamBScore] = useState<number | undefined>(prediction?.teamBScore);

  const [isSubmitDisabled, setSubmitDisabled] = useState(true);

  const parseValue = (value: string) => {
    const num = parseInt(value, 10);
    if (num < 0 || isNaN(num)) return;
    return num;
  };

  const isFormDisabled = useMemo(() => dayjs(game.kickoff.toDate()).isBefore(dayjs()), [game.kickoff]);

  useEffect(() => {
    if (isFormDisabled) {
      setSubmitDisabled(true);
      return;
    }

    setSubmitDisabled(
      teamAScore === undefined ||
        teamBScore === undefined ||
        (teamAScore === prediction?.teamAScore && teamBScore === prediction?.teamBScore)
    );
  }, [teamAScore, teamBScore, prediction, isFormDisabled]);

  const onTeamAChange: ChangeEventHandler<HTMLInputElement> = (e) => setTeamAScore(parseValue(e.target.value));
  const onTeamBChange: ChangeEventHandler<HTMLInputElement> = (e) => setTeamBScore(parseValue(e.target.value));

  return {
    teamAScore: teamAScore?.toString() || "",
    teamBScore: teamBScore?.toString() || "",
    onTeamAChange,
    onTeamBChange,
    isSubmitDisabled,
    isFormDisabled,
  };
};
