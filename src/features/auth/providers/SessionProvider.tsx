"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCookie, setCookie, deleteCookie } from "@/utils/session";
import { AuthUser } from "@/types/auth";
import { getCurrentUser } from "@/api/auth";

interface SessionContextType {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const ACTIVITY_COOKIE = "plannerhq_last_activity";
const INACTIVITY_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const lastUpdateRef = useRef<number>(0);
  const supabase = createClient();

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Monitor activity and update cookie
  useEffect(() => {
    const updateActivity = () => {
      const now = Date.now();
      // Throttle cookie updates to once every minute to reduce document.cookie overhead
      if (now - lastUpdateRef.current > 60000) {
        lastUpdateRef.current = now;
        setCookie(ACTIVITY_COOKIE, now.toString(), INACTIVITY_TIMEOUT);
      }
    };

    // Only monitor activity if user is logged in
    if (!user) return;

    // Set initial activity cookie if not present
    if (!getCookie(ACTIVITY_COOKIE)) {
      setCookie(ACTIVITY_COOKIE, Date.now().toString(), INACTIVITY_TIMEOUT);
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [user]);

  // Check session inactivity on mount and route changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const lastActivity = getCookie(ACTIVITY_COOKIE);
          if (!lastActivity) {
            // Expired (cookie missing) -> Log out
            await supabase.auth.signOut();
            deleteCookie(ACTIVITY_COOKIE);
            setUser(null);
            
            // Redirect to signin with expired parameter if on a protected route
            const isAuthRoute = ["/signin", "/signup", "/verify-otp", "/forgot-password"].includes(pathname || "");
            if (pathname && !isAuthRoute) {
              router.push("/signin?expired=true");
            }
          } else {
            // Valid session and active, refresh user profile if not set
            if (!user) {
              await refreshUser();
            }
          }
        } else {
          // No session
          if (user) {
            setUser(null);
          }
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [pathname, supabase, router, user, refreshUser]);

  // Listen for Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Ensure activity cookie is set
        setCookie(ACTIVITY_COOKIE, Date.now().toString(), INACTIVITY_TIMEOUT);
        await refreshUser();
      } else {
        deleteCookie(ACTIVITY_COOKIE);
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, refreshUser]);

  return (
    <SessionContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
