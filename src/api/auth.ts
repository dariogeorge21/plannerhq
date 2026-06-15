import { createClient } from "@/lib/supabase/client";
import { AuthUser, SignUpResponse, VerifyOtpResponse, SignInResponse } from "@/types/auth";

/**
 * Signs up a new user using email and password.
 * The display name is stored in the raw user metadata, which is used by the database trigger
 * to automatically generate a public profile record.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<SignUpResponse> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      return { success: false, user: null, message: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, user: null, message: error.message || "An unexpected error occurred" };
  }
}

/**
 * Verifies the email confirmation OTP code sent during signup.
 * On success, logs the user in and establishes a session.
 */
export async function verifyOtp(
  email: string,
  token: string
): Promise<VerifyOtpResponse> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      return { success: false, session: null, user: null, message: error.message };
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      session: null,
      user: null,
      message: error.message || "An unexpected error occurred",
    };
  }
}

/**
 * Signs in an existing user using email and password.
 */
export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, session: null, user: null, message: error.message };
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      session: null,
      user: null,
      message: error.message || "An unexpected error occurred",
    };
  }
}

/**
 * Signs out the current user, clearing their session.
 */
export async function signOut(): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}

/**
 * Retrieves the current session (if any).
 */
export async function getSession() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current authenticated user details combined with their database profile.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }

    // Fetch details from public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // Return user metadata as fallback if profile not generated yet
      return {
        id: user.id,
        email: user.email || "",
        displayName: user.user_metadata?.display_name || splitEmailName(user.email || ""),
        hqid: "",
        theme: "system",
        timezone: "UTC",
        createdAt: user.created_at,
        updatedAt: user.created_at,
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      hqid: profile.hqid,
      theme: profile.theme as "light" | "dark" | "system",
      timezone: profile.timezone || "UTC",
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch {
    return null;
  }
}

function splitEmailName(email: string): string {
  if (!email) return "";
  return email.split("@")[0];
}
