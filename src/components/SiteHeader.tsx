import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Wand2, Sparkles, User, ArrowRight } from "lucide-react";

export function SiteHeader() {
  const { session } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link
            to="/features"
            className="transition-colors hover:text-foreground hover:scale-105 duration-150"
            activeProps={{ className: "text-primary font-semibold" }}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="transition-colors hover:text-foreground hover:scale-105 duration-150"
            activeProps={{ className: "text-primary font-semibold" }}
          >
            Pricing
          </Link>
          {session && (
            <>
              <Link
                to="/dashboard"
                className="transition-colors hover:text-foreground hover:scale-105 duration-150 flex items-center gap-1.5"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/app"
                className="transition-colors hover:text-foreground hover:scale-105 duration-150 flex items-center gap-1.5"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                <Wand2 className="h-4 w-4" />
                Workspace
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <Button
              asChild
              size="sm"
              className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 transition-all duration-200"
            >
              <Link to="/app" className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-4 w-4" />
                Open App
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hover:bg-accent/50 text-muted-foreground hover:text-foreground">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 transition-all duration-200 font-semibold"
              >
                <Link to="/auth" search={{ mode: "signup" }} className="flex items-center gap-1">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}