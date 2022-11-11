import { PropsWithChildren, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/features/auth";

// Route available only for signed out users
export const AnonymousRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};
