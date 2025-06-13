import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthRoutes } from "./routes/auth";
import { MainRoutes } from "./routes/main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OpenAPI } from "./api-swagger";
import { URL_API } from "./utils/constants";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

OpenAPI.BASE = URL_API;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10000,
    },
    mutations: {
      onError: (error) => {
        if ((error as any).code === "ECONNABORTED") {
          toast.error(
            "Temps d'attente de la requête, veuillez réessayer plus tard"
          );
        }
        toast.error(error?.message);
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        console.error(`Something went wrong: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache(),
});

const renderReactQueryDevtools = () =>
  import.meta.env.DEV ? (
    <ReactQueryDevtools
      initialIsOpen={false}
      buttonPosition={document.dir === "rtl" ? "bottom-right" : "bottom-left"}
    />
  ) : null;

// Root route component that handles redirection
const RootRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-formality-primary"></div>
      </div>
    );
  }

  // Only redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Otherwise, stay on current path
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Sonner />
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/auth/*" element={<AuthRoutes />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
          {renderReactQueryDevtools()}
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
