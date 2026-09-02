import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function cleanAuthHashAndHandleRedirect(currentSession: Session | null) {
  if (typeof window !== "undefined") {
    const hasOAuthHash = window.location.hash && (window.location.hash.includes("access_token=") || window.location.hash.includes("error="));
    const hasOAuthSearch = window.location.search && (window.location.search.includes("code=") || window.location.search.includes("error="));
    const isOAuthReturn = !!(hasOAuthHash || hasOAuthSearch);

    // 1. Clean hash parameters from URL
    if (hasOAuthHash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // 2. Clean query code parameters from URL (PKCE)
    if (window.location.search && window.location.search.includes("code=")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      const searchStr = url.searchParams.toString();
      window.history.replaceState(null, "", url.pathname + (searchStr ? "?" + searchStr : "") + url.hash);
    }

    // 3. If returning from OAuth onto root or /auth with an active session, navigate directly to /app
    if (isOAuthReturn && currentSession && (window.location.pathname === "/" || window.location.pathname === "/auth")) {
      window.location.assign("/app");
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    // 1. Subscribe to auth state changes FIRST (handles OAuth redirects, token refreshes, sign in/out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        if (currentSession) {
          cleanAuthHashAndHandleRedirect(currentSession);
        }
      }
    });

    // 2. Fetch initial session
    async function getInitialSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[Auth] Session retrieval notice:", error.message);
        }
        
        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            cleanAuthHashAndHandleRedirect(initialSession);
          }
        }
      } catch (err) {
        console.error("[Auth] Error fetching initial session:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
    } catch (queryErr) {
      console.error("[Auth] Error clearing cache on signout:", queryErr);
    }
    
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[Auth] Error signing out:", err);
    } finally {
      setUser(null);
      setSession(null);
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
