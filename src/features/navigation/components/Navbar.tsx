import { Link } from "react-router-dom";

import { useAuthContext } from "src/features/auth";

export const Navbar: React.FC = () => {
  const { signOut } = useAuthContext();

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link className="btn-ghost btn text-xl normal-case" to="/">
          Strona główna
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle btn">
            <div className="flex h-4 w-10 flex-col items-center justify-between rounded-full">
              <div className="w-6 bg-base-content" style={{ height: 2 }} />
              <div className="w-6 bg-base-content" style={{ height: 2 }} />
              <div className="w-6 bg-base-content" style={{ height: 2 }} />
            </div>
          </label>
          <ul tabIndex={0} className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-200 p-2 shadow">
            <li onClick={signOut}>
              <span>Wyloguj</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
