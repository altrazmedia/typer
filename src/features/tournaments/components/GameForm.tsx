import { Timestamp } from "firebase/firestore";
import { ChangeEvent, FormEvent, useState } from "react";

import { FormInput } from "src/features/ui";

import type { Game, GameDB } from "../types";

interface Props {
  game?: Game;
  submit(game: GameDB): void;
  isLoading?: boolean;
  header?: string;
}

type Errors = {
  [key in keyof GameDB]?: string;
};

interface GameFormValues extends Omit<GameDB, "kickoff"> {
  kickoff: string;
}

const parseGameToState = (game: Game): GameFormValues => ({
  ...game,
  kickoff: game.kickoff.toDate().toISOString().replace("Z", ""),
});

export const GameForm: React.FC<Props> = ({ game, submit, isLoading, header }) => {
  const [values, setValues] = useState<GameFormValues>(
    game
      ? parseGameToState(game)
      : {
          kickoff: "",
          teamA: "",
          teamB: "",
        }
  );
  const [errors, setErrors] = useState<Errors>({});

  const handleTeamChange = (field: "teamA" | "teamB") => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((state) => ({
      ...state,
      [field]: e.target.value,
    }));
  };

  const handleScoreChange = (field: "teamAScore" | "teamBScore") => (e: ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(e.target.value);
    setValues((state) => ({
      ...state,
      [field]: isNaN(score) || score < 0 ? undefined : score,
    }));
  };

  const handleKickoffChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((state) => ({
      ...state,
      kickoff: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      submit({
        ...values,
        kickoff: Timestamp.fromDate(new Date(values.kickoff)),
      });
    }
  };

  const validate = () => {
    const errors: Errors = {};
    const requriedFiledMessage = "To pole jest wymagane";
    const bothTeamScoreRequired = "Podaj wynik dla obu drużyn lub zostaw oba pola puste";

    (["teamA", "teamB", "kickoff"] as (keyof GameFormValues)[]).forEach((field) => {
      if (!values[field]) {
        errors[field] = requriedFiledMessage;
      }
    });

    if (values.teamBScore !== undefined && values.teamAScore === undefined) {
      errors.teamAScore = bothTeamScoreRequired;
    }

    setErrors(errors);

    return !Object.keys(errors).length;
  };

  return (
    <form onSubmit={handleSubmit}>
      {!!header && <h1 className="mb-4 text-center text-2xl">{header}</h1>}
      <span className="text-lg">Drużyny</span>
      <div className="mt-3 mb-4 flex flex-row items-center">
        <FormInput
          value={values.teamA}
          onChange={handleTeamChange("teamA")}
          wrapperClassName="mb-0"
          error={errors.teamA}
        />
        <span className="mx-2">-</span>
        <FormInput
          value={values.teamB}
          onChange={handleTeamChange("teamB")}
          wrapperClassName="mb-0"
          error={errors.teamB}
        />
      </div>
      <span className="text-lg">Wynik</span>
      <div className="mt-3 mb-4 flex flex-row items-center ">
        <FormInput
          value={values.teamAScore?.toString() || ""}
          onChange={handleScoreChange("teamAScore")}
          wrapperClassName="mb-0"
          error={errors.teamAScore}
        />
        <span className="mx-2">-</span>
        <FormInput
          value={values.teamBScore?.toString() || ""}
          onChange={handleScoreChange("teamBScore")}
          wrapperClassName="mb-0"
          error={errors.teamBScore}
        />
      </div>
      <span className="text-lg">Data</span>
      <div className="mt-3 mb-6">
        <FormInput
          value={values.kickoff}
          onChange={handleKickoffChange}
          wrapperClassName="mb-0"
          type="datetime-local"
          error={errors.kickoff}
        />
      </div>
      <button className="btn-primary btn w-full" disabled={isLoading}>
        Zapisz
      </button>
    </form>
  );
};
