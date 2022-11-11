import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Register, SignIn } from "src/features/auth";
import { Page404 } from "./404";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    errorElement: <Page404 />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export const Router: React.FC<any> = () => {
  return <RouterProvider router={browserRouter} />;
};
