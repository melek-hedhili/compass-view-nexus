import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContextType } from "./authTypes";
import { AuthService } from "@/api-swagger/services/AuthService";
import { LoginRequestDto } from "@/api-swagger/models/LoginRequestDto";
import { OpenAPI, UserDto, UserService } from "@/api-swagger";
import { useEmailNotifications } from "@/hooks/use-email-notifications";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Initialize email notifications when user is authenticated
  useEmailNotifications();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      OpenAPI.TOKEN = token;
    }
    setLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    OpenAPI.TOKEN = undefined;
    setUser(null);
    queryClient.clear();
    navigate("/auth/login", { replace: true });
  }, [navigate, queryClient]);

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => UserService.userControllerGetProfile(),
    enabled: !!localStorage.getItem("access_token"),
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (profileError) {
      console.error("Failed to fetch user profile:", profileError);
      handleLogout();
    }
  }, [profileError, handleLogout]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequestDto) =>
      AuthService.authControllerLogin({ requestBody: credentials }),
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access_token);
      OpenAPI.TOKEN = data.access_token;

      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
      toast.success("Connexion réussie");
    },
  });

  const roleAccessMap: Record<string, string[]> = {
    ADMIN: ["*"],
    JURIST: ["*"],
    OPERATOR: ["dashboard", "dossiers"],
  };

  const canAccessSection = (section: string): boolean => {
    if (!user) return false;
    const access = roleAccessMap[user.role];
    return access?.includes("*") || access?.includes(section);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    SignIn: loginMutation.mutateAsync,
    logout: handleLogout,
    loading: loading || isProfileLoading,
    canAccessSection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
