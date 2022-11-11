import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth";

// Route available only for signed out users
export const AnonymousRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};
