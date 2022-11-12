import { Timestamp } from "firebase/firestore";

export interface TournamentDB {
  name: string;
  description: string;
  members: string[];
}

export interface Tournament extends TournamentDB {
  id: string;
}

export interface GameDB {
  kickoff: Timestamp;
  teamA: string;
  teamB: string;
  teamAScore?: number;
  teamBScore?: number;
}

export interface Game extends GameDB {
  id: string;
}

export type GamesListType = "upcoming" | "past";
