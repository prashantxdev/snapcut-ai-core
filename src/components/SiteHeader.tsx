import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export function SiteHeader() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/features" className="transition-colors hover:text-foreground">Features</Link>
          <Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          {session && (
            <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <Button asChild size="sm" className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/app">Open app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/auth" search={{ mode: "signup" }}>Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}