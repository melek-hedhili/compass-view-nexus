import type { UserDto } from "@/api-swagger/models/UserDto";
import type { LoginRequestDto } from "@/api-swagger/models/LoginRequestDto";
import type { LoginResponseDto } from "@/api-swagger/models/LoginResponseDto";
import type { UseMutationResult } from "@tanstack/react-query";

export interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<
    LoginResponseDto,
    Error,
    LoginRequestDto,
    unknown
  >;
  logout: () => void;
  loading: boolean;
  canAccessSection: (section: string) => boolean;
}
