import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  UploadCloud,
  History as HistoryIcon,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab");

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Upload / Workspace",
      href: "/app",
      icon: UploadCloud,
      active: pathname === "/app" && currentTab !== "history",
    },
    {
      name: "History",
      href: "/app?tab=history",
      icon: HistoryIcon,
      active: pathname === "/app" && currentTab === "history",
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
      active: pathname === "/billing",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40 border-r border-border/50 bg-sidebar/80 backdrop-blur-xl">
        {/* Sidebar Header / Logo */}
        <div className="flex h-16 items-center px-6 border-b border-border/40">
          <Logo />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group ${
                  item.active
                    ? "text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                {item.active && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-brand shadow-glow"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                    item.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span className="relative z-10">{item.name}</span>
                {item.active && (
                  <ChevronRight className="relative z-10 ml-auto h-4 w-4 text-primary-foreground opacity-80" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-border/40">
          <div className="glass-card flex items-center justify-between gap-3 p-3 rounded-xl border border-border/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-xs font-bold text-primary-foreground shadow-glow">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {user?.email || "User"}
                </p>
                <span className="inline-block text-[10px] text-muted-foreground">
                  Free Tier
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              title="Sign Out"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-foreground"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Logo />
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 text-xs font-semibold"
            >
              <Link to="/app">
                <UploadCloud className="mr-1.5 h-3.5 w-3.5" /> Quick Upload
              </Link>
            </Button>

            <div className="flex items-center gap-2 pl-2 border-l border-border/40">
              <Link
                to="/settings"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-xs font-bold text-foreground border border-border/50 hover:border-primary/50 transition-colors"
                title="Account Settings"
              >
                {userInitial}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="hidden sm:flex text-xs text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-1 h-3.5 w-3.5" /> Sign out
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-border/50 bg-sidebar/95 backdrop-blur-2xl px-4 py-4 space-y-2 z-40"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      item.active
                        ? "bg-gradient-brand text-primary-foreground font-semibold shadow-glow"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-destructive text-xs">
                  <LogOut className="mr-1 h-3.5 w-3.5" /> Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 bg-grid-pattern relative">{children}</main>
      </div>
    </div>
  );
}