import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Root: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="prose mx-auto mt-24 max-w-7xl px-5 sm:px-10 md:px-28 lg:px-36">
        <Outlet />
      </div>
    </div>
  );
};
