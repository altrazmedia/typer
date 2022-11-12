import { PropsWithChildren, useState } from "react";
import { useParams } from "react-router-dom";

import { useTournament } from "./queries";
import { GamesListType } from "./types";
import { GamesList } from "./GamesList";

type TabID = "upcoming" | "past" | "table";
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
      {data && (
        <>
          <h1>{data.name}</h1>
          <p>{data.description}</p>

          <div className="tabs mb-8 justify-center">
            <Tab id="upcoming" onClick={setActiveTab} isActive={activeTab === "upcoming"}>
              Nadchodzące mecze
            </Tab>
            <Tab id="past" onClick={setActiveTab} isActive={activeTab === "past"}>
              Rozegrane mecze
            </Tab>
            <Tab id="table" onClick={setActiveTab} isActive={activeTab === "table"}>
              Tabela
            </Tab>
          </div>
          {["upcoming", "past"].includes(activeTab) && (
            <GamesList tournamentId={id!} listType={activeTab as GamesListType} />
          )}
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
  <span className={`tab tab-bordered ${isActive ? "tab-active" : ""}`} onClick={() => onClick(id)}>
    {children}
  </span>
);