import { useParams } from "react-router-dom";
import { useTournament } from "./queries";

export const Tournament = () => {
  const { id } = useParams();
  const { data, isLoading } = useTournament(id!);

  return (
    <div>
      {data && (
        <>
          <h1>{data.name}</h1>
          <p>{data.description}</p>
        </>
      )}
      {!data && !isLoading && (
        <div className="alert alert-error shadow-lg">
          <div>
            <span>Nie udało się pobrać informacji o turnieju</span>
          </div>
        </div>
      )}
    </div>
  );
};
