import type { PredictionStatus } from "./types";

const isScoreDefined = (value: number | undefined): value is number => value !== undefined && value !== null;

export const getPredictionStatus = (params: {
  teamAPrediction?: number;
  teamBPrediction?: number;
  teamAScore?: number;
  teamBScore?: number;
}): PredictionStatus => {
  const { teamAPrediction, teamBPrediction, teamAScore, teamBScore } = params;

  if (
    !isScoreDefined(teamAScore) ||
    !isScoreDefined(teamBScore) ||
    !isScoreDefined(teamAPrediction) ||
    !isScoreDefined(teamBPrediction)
  ) {
    return "none";
  }

  if (teamAScore === teamAPrediction && teamBScore === teamBPrediction) {
    return "exact";
  }

  if (
    (teamAScore > teamBScore && teamAPrediction > teamBPrediction) ||
    (teamAScore < teamBScore && teamAPrediction < teamBPrediction) ||
    (teamAScore === teamBScore && teamAPrediction === teamBPrediction)
  ) {
    return "result";
  }

  return "missed";
};
