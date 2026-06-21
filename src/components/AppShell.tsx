import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, LayoutDashboard, Wand2 } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard" activeProps={{ className: "text-foreground" }} className="text-muted-foreground">
                <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app" activeProps={{ className: "text-foreground" }} className="text-muted-foreground">
                <Wand2 className="mr-1 h-4 w-4" /> Workspace
              </Link>
            </Button>
          </nav>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-1 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}