import { User, Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  hqid: string;
  theme: "light" | "dark" | "system";
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpResponse {
  success: boolean;
  user: User | null;
  message?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  session: Session | null;
  user: User | null;
  message?: string;
}

export interface SignInResponse {
  success: boolean;
  session: Session | null;
  user: User | null;
  message?: string;
}
