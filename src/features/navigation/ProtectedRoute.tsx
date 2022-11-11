import { PropsWithChildren, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/features/auth";

// Route available only for signed in users
export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
};
