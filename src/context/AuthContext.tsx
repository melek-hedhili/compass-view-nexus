import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type AuthContextType } from "./authTypes";
import { OpenAPI, type UserDto, UserService, AuthService } from "@/api-swagger";
import { type LoginRequestDto } from "@/api-swagger/models/LoginRequestDto";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Role-based access control map
const ROLE_ACCESS_MAP: Record<string, string[]> = {
  ADMIN: ["*"],
  JURIST: ["*"],
  OPERATOR: ["dashboard", "dossiers"],
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const initializationRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Memoized authentication state
  const isAuthenticated = useMemo(
    () => !!user && !!localStorage.getItem("access_token"),
    [user]
  );

  // Optimized logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    OpenAPI.TOKEN = undefined;
    setUser(null);
    queryClient.clear();
    navigate("/auth/login", { replace: true });
  }, [navigate, queryClient]);

  // Profile query with optimized settings
  const {
    data: userProfile,
    isSuccess,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => UserService.userControllerGetProfile(),
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Single initialization effect
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      OpenAPI.TOKEN = token;

      try {
        const profile = await refetchProfile();
        if (profile.data) {
          setUser(profile.data);
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array - only run once

  // Update user when profile data changes
  useEffect(() => {
    if (userProfile && isSuccess) {
      setUser(userProfile);
    }
  }, [userProfile, isSuccess]);

  // Handle profile errors
  useEffect(() => {
    if (profileError && user) {
      handleLogout();
    }
  }, [profileError, user, handleLogout]);

  // Optimized login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequestDto) =>
      AuthService.authControllerLogin({ requestBody: credentials }),
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access_token);
      OpenAPI.TOKEN = data.access_token;

      try {
        const profile = await refetchProfile();
        if (profile.data) {
          setUser(profile.data);
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
          toast.success("Connexion réussie");
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch {
        toast.error(
          "Une erreur est survenue lors de la récupération du profil."
        );
        handleLogout();
      }
    },
    onError: () => {
      toast.error("Échec de la connexion. Veuillez vérifier vos identifiants.");
    },
  });

  // Memoized access control function
  const canAccessSection = useCallback(
    (section: string): boolean => {
      if (!user) return false;
      const access = ROLE_ACCESS_MAP[user.role];
      return access?.includes("*") || access?.includes(section);
    },
    [user]
  );

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      loginMutation,
      logout: handleLogout,
      loading,
      canAccessSection,
    }),
    [
      user,
      isAuthenticated,
      loginMutation,
      handleLogout,
      loading,
      canAccessSection,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
