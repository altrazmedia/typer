import { Link } from "react-router-dom";

import { useAuthContext } from "src/features/auth";
import { Spinner } from "src/features/ui";

import { useMyTournamentsList } from "./queries";

export const TournamentsList: React.FC = () => {
  const { user } = useAuthContext();
  const { data, isLoading } = useMyTournamentsList(user!.uid);

  return (
    <div>
      <h1>Turnieje</h1>
      {isLoading && <Spinner />}
      <div className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((tournament) => (
          <Link to={`/t/${tournament.id}`} key={tournament.id}>
            <div className="card-compact card w-full bg-base-100 py-3 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{tournament.name}</h2>
                <p>{tournament.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!isLoading && !data?.length && <h2>Wygląda na to, że nie jesteś zapisany do żadnego turnieju</h2>}
    </div>
  );
};
