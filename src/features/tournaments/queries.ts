import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";

import { createCollection } from "src/firebase";

import type { Game, GameDB, GamesListType, Tournament, TournamentDB } from "./types";

const tournamentsCollection = createCollection<TournamentDB>("tournaments");

export const useMyTournamentsList = (userId: string) => {
  return useQuery({
    queryKey: ["MY_TOURNAMENTS", { userId }] as const,
    queryFn: async ({ queryKey }) => {
      const [_, { userId }] = queryKey;
      const q = query(tournamentsCollection, where("members", "array-contains", userId));
      const result = await getDocs(q);

      return result.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Tournament[];
    },
  });
};

export const useTournament = (tournamentId: string) => {
  return useQuery({
    queryKey: ["TOURNAMENT", { tournamentId }] as const,
    queryFn: async ({ queryKey }) => {
      const [_, { tournamentId }] = queryKey;
      const docRef = doc(tournamentsCollection, tournamentId);
      const result = await getDoc(docRef);

      if (result.exists()) {
        return {
          ...result.data(),
          id: result.id,
        } as Tournament;
      }

      return null;
    },
  });
};

export const useTournamentGames = (tournamentId: string, type: GamesListType) => {
  return useQuery({
    queryKey: ["TOURNAMENT_GAMES", { tournamentId, type }] as const,
    queryFn: async ({ queryKey }) => {
      const [_, { tournamentId, type }] = queryKey;
      const upcoming = type === "upcoming";
      const gamesCollection = createCollection<GameDB>(`tournaments/${tournamentId}/games`);
      const now = Timestamp.now();
      const q = query(
        gamesCollection,
        where("kickoff", upcoming ? ">" : "<=", now),
        orderBy("kickoff", upcoming ? "asc" : "desc")
      );
      const result = await getDocs(q);

      return result.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Game));
    },
  });
};
