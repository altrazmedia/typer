import { useQuery } from "@tanstack/react-query";
import { getDocs, query, where } from "firebase/firestore";
import { createCollection } from "src/firebase";
import { Tournament, TournamentDB } from "./types";

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
