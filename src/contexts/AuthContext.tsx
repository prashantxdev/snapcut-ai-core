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

function cleanAuthHash() {
  if (typeof window !== "undefined") {
    // If the hash contains OAuth parameters, strip it cleanly from the address bar
    if (window.location.hash && (window.location.hash.includes("access_token=") || window.location.hash.includes("error="))) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    // If search parameters contain OAuth code (PKCE)
    if (window.location.search && window.location.search.includes("code=")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      const searchStr = url.searchParams.toString();
      window.history.replaceState(null, "", url.pathname + (searchStr ? "?" + searchStr : "") + url.hash);
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
          cleanAuthHash();
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
        
        if (mounted && initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          cleanAuthHash();
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
