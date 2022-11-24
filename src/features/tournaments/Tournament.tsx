import { PropsWithChildren, useState } from "react";
import { useParams } from "react-router-dom";

import { Spinner } from "src/features/ui";

import { useTournament } from "./queries";
import { GamesListType } from "./types";
import { GamesList } from "./GamesList";
import { Standings } from "./Standings";

type TabID = "upcoming" | "past" | "standings";
interface TabProps extends PropsWithChildren {
  id: TabID;
  isActive: boolean;
  onClick(id: TabID): void;
}

export const Tournament = () => {
  const { id } = useParams();
  const { data, isLoading } = useTournament(id!);
  const [activeTab, setActiveTab] = useState<TabID>("upcoming");

  return (
    <div>
      {isLoading && <Spinner />}
      {data && (
        <>
          <h1>{data.name}</h1>
          <p>{data.description}</p>

          <div className="mb-7 overflow-x-auto pb-2">
            <div className="tabs flex-nowrap md:justify-center">
              <Tab id="upcoming" onClick={setActiveTab} isActive={activeTab === "upcoming"}>
                Nadchodzące mecze
              </Tab>
              <Tab id="past" onClick={setActiveTab} isActive={activeTab === "past"}>
                Rozegrane mecze
              </Tab>
              <Tab id="standings" onClick={setActiveTab} isActive={activeTab === "standings"}>
                Tabela
              </Tab>
            </div>
          </div>
          {["upcoming", "past"].includes(activeTab) && (
            <GamesList tournamentId={id!} listType={activeTab as GamesListType} />
          )}
          {activeTab === "standings" && <Standings tournamentId={id!} />}
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

const Tab: React.FC<TabProps> = ({ id, isActive, onClick, children }) => (
  <span className={`tab tab-bordered ${isActive ? "tab-active" : ""} flex-shrink-0`} onClick={() => onClick(id)}>
    {children}
  </span>
);
