import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Register, SignIn } from "src/features/auth";
import { TournamentsList } from "src/features/tournaments";

import { Home } from "./Home";
import { Page404 } from "./404";
import { AnonymousRoute } from "./AnonymousRoute";
import { ProtectedRoute } from "./ProtectedRoute";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
        <TournamentsList />
      </ProtectedRoute>
    ),
    errorElement: <Page404 />,
  },
  {
    path: "/login",
    element: (
      <AnonymousRoute>
        <SignIn />
      </AnonymousRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <AnonymousRoute>
        <Register />
      </AnonymousRoute>
    ),
  },
]);

export const Router: React.FC<any> = () => {
  return <RouterProvider router={browserRouter} />;
};
