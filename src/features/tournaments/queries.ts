import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";

import { createCollection } from "src/firebase";
import type { Profile } from "src/features/auth";

import type {
  Game,
  GameDB,
  GamesListType,
  Prediction,
  PredictionDB,
  PredictionParams,
  Tournament,
  TournamentDB,
} from "./types";
import { useCallback } from "react";

const tournamentsCollection = createCollection<TournamentDB>("tournaments");
const predictionsCollection = createCollection<PredictionDB>("predictions");
const profilesCollection = createCollection<Profile>("profiles");

const MY_PREDICTIONS_KEY = "MY_PREDICTIONS";

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
    staleTime: 60 * 60 * 1000,
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
    staleTime: 60 * 60 * 1000,
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

export const useMyPredictions = (params: { uid: string; gamesIds: string[]; isEnabled: boolean }) => {
  const { gamesIds, isEnabled, uid } = params;
  return useQuery({
    queryKey: [MY_PREDICTIONS_KEY, { gamesIds, uid }] as const,
    queryFn: async ({ queryKey }) => {
      const [_, { gamesIds, uid }] = queryKey;
      const q = query(predictionsCollection, where("uid", "==", uid), where("gameId", "in", gamesIds));
      const result = await getDocs(q);

      return result.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Prediction));
    },
    enabled: isEnabled && !!gamesIds.length,
    staleTime: 60 * 60 * 1000,
  });
};

export const usePredictionActions = (uid: string, gameId: string) => {
  const queryClient = useQueryClient();

  const addOrEditPrediction = useMutation<void, any, PredictionParams, any>({
    mutationFn: async ({ teamAScore, teamBScore }) => {
      const q = query(predictionsCollection, where("uid", "==", uid), where("gameId", "==", gameId));
      const result = await getDocs(q);
      const prediction = result.docs[0];
      const docRef = prediction?.ref || doc(predictionsCollection);
      await setDoc(docRef, { gameId, uid, teamAScore, teamBScore });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([MY_PREDICTIONS_KEY]);
    },
    onError: () => {
      window.alert("Nie udało się zapisać typu. Możliwe, że mecz się już rozpoczął");
    },
  });

  return { addOrEditPrediction };
};

export const useTournamentMembers = (tournamentId: string) => {
  const { data: tournamentData } = useTournament(tournamentId);

  const queryData = useQuery({
    queryKey: ["TOURNAMENT_MEMBERS", { tournamentId }] as const,
    queryFn: async () => {
      const q = query(profilesCollection, where("uid", "in", tournamentData?.members));
      const result = await getDocs(q);

      return result.docs.map((doc) => doc.data());
    },
    staleTime: 60 * 60 * 1000,
    enabled: !!tournamentData?.members.length,
  });

  const findMemberName = useCallback(
    (uid: string) => {
      const member = queryData.data?.find((item) => item.uid === uid);
      return member?.name || uid;
    },
    [queryData.data]
  );

  return { ...queryData, findMemberName };
};

export const useGamePredictions = (gameId: string) => {
  return useQuery({
    queryKey: ["GAME_PREDICTIONS", { gameId }] as const,
    queryFn: async () => {
      const q = query(predictionsCollection, where("gameId", "==", gameId));
      const result = await getDocs(q);

      return result.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Prediction));
    },
    staleTime: 60 * 60 * 1000,
  });
};
