import React, { createContext, useContext, useEffect, useState } from "react";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    // 1. Get initial session
    async function getInitialSession() {
      try {
        console.log("[AuthContext] Fetching initial session...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AuthContext] Error getting initial session:", error);
        }
        
        if (mounted) {
          console.log("[AuthContext] Initial session retrieved:", initialSession);
          console.log("[AuthContext] Initial user retrieved:", initialSession?.user ?? null);
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      } catch (err) {
        console.error("[AuthContext] Unexpected error getting initial session:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(`[AuthContext] Auth state changed: ${event}`, currentSession);
      console.log(`[AuthContext] User details:`, currentSession?.user ?? null);
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    console.log("[AuthContext] Logging out...");
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
    } catch (queryErr) {
      console.error("[AuthContext] Error clearing queries on signout:", queryErr);
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[AuthContext] Error signing out from Supabase:", error);
    }
    
    setUser(null);
    setSession(null);
  }

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
