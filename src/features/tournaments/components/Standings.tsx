import { Spinner } from "src/features/ui";

import { useStandings, useTournament, useTournamentMembers } from "../hooks";

interface Props {
  tournamentId: string;
}

export const Standings: React.FC<Props> = ({ tournamentId }) => {
  const { data: tournamentData } = useTournament(tournamentId);
  const { data: standingsData, isLoading } = useStandings(tournamentId);
  const { findMemberName } = useTournamentMembers(tournamentId);

  return (
    <>
      {isLoading && <Spinner />}
      {!!standingsData && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Gracz</th>
                <th>Dokładne typy</th>
                <th>Dobre rezultaty</th>
                <th>Punkty</th>
              </tr>
            </thead>
            <tbody>
              {standingsData.map(({ exact, points, results, uid }, index) => (
                <tr key={uid}>
                  <th>{index + 1}</th>
                  <td>{findMemberName(uid)}</td>
                  <td>{exact}</td>
                  <td>{results}</td>
                  <td>{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="whitespace-pre-line">
        Punkty za dokładny typ: {tournamentData?.pointsForExact}
        {"\n"}
        Punkty za dobry wynik: {tournamentData?.pointsForResult}
      </p>
    </>
  );
};
