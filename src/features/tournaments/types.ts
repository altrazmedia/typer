import { Timestamp } from "firebase/firestore";

interface ObjWithId {
  id: string;
}
export interface TournamentDB {
  name: string;
  description: string;
  members: string[];
  pointsForResult: number;
  pointsForExact: number;
  admins: string[];
}

export interface Tournament extends TournamentDB, ObjWithId {}

export interface GameDB {
  kickoff: Timestamp;
  teamA: string;
  teamB: string;
  teamAScore?: number;
  teamBScore?: number;
}

export interface Game extends GameDB, ObjWithId {}

export type GamesListType = "upcoming" | "past";

export interface PredictionDB {
  teamAScore: number;
  teamBScore: number;
  uid: string;
  gameId: string;
}

export interface Prediction extends PredictionDB, ObjWithId {}

export interface PredictionParams {
  teamAScore: number;
  teamBScore: number;
}

export interface EditPredictionParams extends PredictionParams {
  id: string;
}

export type PredictionStatus = "exact" | "result" | "missed" | "none";

export interface StandingsRow {
  uid: string;
  points: number;
  exact: number;
  results: number;
}

export type Standings = StandingsRow[];
