import type { UserDto } from "@/api-swagger/models/UserDto";
import type { LoginRequestDto } from "@/api-swagger/models/LoginRequestDto";
import type { LoginResponseDto } from "@/api-swagger/models/LoginResponseDto";

export interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  SignIn: (credentials: LoginRequestDto) => Promise<LoginResponseDto>;
  logout: () => void;
  loading: boolean;
  canAccessSection: (section: string) => boolean;
}
