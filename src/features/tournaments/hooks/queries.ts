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
  Standings,
  Tournament,
  TournamentDB,
} from "../types";
import { useCallback } from "react";
import { getPredictionStatus } from "../utils";

const tournamentsCollection = createCollection<TournamentDB>("tournaments");
const predictionsCollection = createCollection<PredictionDB>("predictions");
const profilesCollection = createCollection<Profile>("profiles");

const MY_PREDICTIONS_KEY = "MY_PREDICTIONS";
const TOURNAMENT_GAMES_KEY = "TOURNAMENT_GAMES";

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
    queryKey: [TOURNAMENT_GAMES_KEY, { tournamentId, type }] as const,
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

export const useMyPredictions = (params: { uid: string; isEnabled: boolean }) => {
  const { isEnabled, uid } = params;
  return useQuery({
    queryKey: [MY_PREDICTIONS_KEY],
    queryFn: async () => {
      const q = query(predictionsCollection, where("uid", "==", uid));
      const result = await getDocs(q);

      return result.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Prediction));
    },
    enabled: isEnabled,
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

// To be replaced with Functions in the future
export const useStandings = (tournamentId: string) => {
  const { data: tournamentData } = useTournament(tournamentId);

  return useQuery({
    queryKey: ["TABLE", { tournamentId }],
    queryFn: async () => {
      const gamesCollection = createCollection<GameDB>(`tournaments/${tournamentId}/games`);
      // const now = Timestamp.now();
      const gamesQuery = query(gamesCollection, where("teamAScore", ">", -1));
      const gamesResult = await getDocs(gamesQuery);
      const games = gamesResult.docs.map((item) => ({ ...item.data(), id: item.id }));

      const predictionsQuery = query(predictionsCollection, where("uid", "in", tournamentData?.members));
      const predictionsResult = await getDocs(predictionsQuery);
      const predictions = predictionsResult.docs.map((item) => ({ ...item.data(), id: item.id }));

      const standings: Standings = tournamentData!.members.map((uid) => {
        let numberOfExact = 0;
        let numberOfResults = 0;

        games.forEach((game) => {
          const prediction = predictions.find((item) => item.gameId === game.id && item.uid === uid);
          const predictionStatus = getPredictionStatus({
            teamAPrediction: prediction?.teamAScore,
            teamBPrediction: prediction?.teamBScore,
            teamAScore: game.teamAScore,
            teamBScore: game.teamBScore,
          });
          if (predictionStatus === "exact") numberOfExact++;
          if (predictionStatus === "result") numberOfResults++;
        });

        return {
          exact: numberOfExact,
          results: numberOfResults,
          points: numberOfExact * tournamentData!.pointsForExact + numberOfResults * tournamentData!.pointsForResult,
          uid,
        };
      });

      return standings.sort((a, b) => b.points - a.points);
    },
    enabled: !!tournamentData,
  });
};

export const useGameActions = (tournamentId: string) => {
  const queryClient = useQueryClient();
  const gamesCollection = createCollection<GameDB>(`tournaments/${tournamentId}/games`);

  const addGame = useMutation<void, any, GameDB, any>({
    mutationFn: async (gameData) => {
      const docRef = doc(gamesCollection);
      await setDoc(docRef, gameData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([TOURNAMENT_GAMES_KEY]);
    },
    onError: () => {
      window.alert("Nie udało się dodać meczu");
    },
  });

  const editGame = useMutation<void, any, Game, any>({
    mutationFn: async (gameData) => {
      const docRef = doc(gamesCollection, gameData.id);
      await setDoc(docRef, gameData);
    },
    onSuccess: (_, params) => {
      queryClient.setQueriesData<Game[]>(
        [TOURNAMENT_GAMES_KEY],
        (data) => data?.map((game) => (game.id === params.id ? params : game)) || []
      );
    },
  });

  return { addGame, editGame };
};
