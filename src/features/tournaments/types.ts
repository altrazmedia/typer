export interface TournamentDB {
  name: string;
  description: string;
  members: string[];
}

export interface Tournament extends TournamentDB {
  id: string;
}
