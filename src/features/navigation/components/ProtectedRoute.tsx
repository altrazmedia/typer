import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth";

// Route available only for signed in users
export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
};
