import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Register, SignIn, useAuthContext } from "src/features/auth";
import { Tournament, TournamentsList } from "src/features/tournaments";

import { Page404 } from "./404";
import { AnonymousRoute } from "./AnonymousRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { Root } from "./Root";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <Page404 />,
    children: [
      {
        path: "/",
        element: <TournamentsList />,
      },
      {
        path: "/t/:id",
        element: <Tournament />,
      },
    ],
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
  const { isChecking } = useAuthContext();

  // App is checking if any user is already signed in
  if (isChecking) return null;

  return <RouterProvider router={browserRouter} />;
};
