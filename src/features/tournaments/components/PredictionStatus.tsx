import { getPredictionStatus } from "../utils";

interface Props {
  teamAPrediction?: number;
  teamBPrediction?: number;
  teamAScore?: number;
  teamBScore?: number;
}

export const PredictionStatus: React.FC<Props> = ({ teamAPrediction, teamBPrediction, teamAScore, teamBScore }) => {
  const status = getPredictionStatus({ teamAPrediction, teamBPrediction, teamAScore, teamBScore });

  return (
    <div
      className={`h-6 w-6 rounded-full ${
        status === "exact"
          ? "bg-success"
          : status === "result"
          ? "bg-warning"
          : status === "missed"
          ? "bg-error"
          : "bg-transparent"
      }`}
    ></div>
  );
};
