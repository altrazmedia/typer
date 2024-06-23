import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthContextProvider } from "src/features/auth/contexts";
import { Router } from "src/features/navigation";
import { NotificationsProvider } from "src/features/notifications/context/NotificationsContext";
import { ToastNotifications } from "src/features/notifications/components/ToastsNotifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        <AuthContextProvider>
          <ToastNotifications />
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthContextProvider>
      </NotificationsProvider>
    </QueryClientProvider>
  );
};

export default App;
