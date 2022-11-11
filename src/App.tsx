import { Router } from "src/features/navigation";
import { AuthContextProvider } from "./features/auth/AuthContext";

const App = () => {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
};

export default App;
