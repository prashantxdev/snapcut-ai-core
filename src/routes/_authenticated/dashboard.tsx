import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/dashboard.functions";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Wand2,
  ImageOff,
  Check,
  Loader2,
  AlertTriangle,
  Sparkles,
  CreditCard,
  Zap,
  ArrowRight,
  Clock,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SnapCut AI" },
      { name: "description", content: "Your credits, plan, and recent uploads." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card rounded-3xl p-6 sm:p-8 border border-border/60 bg-card/60 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-brand opacity-15 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-2xl font-extrabold text-primary-foreground shadow-glow">
              {userInitial}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Welcome back!
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {user?.email} · Manage your credits and recent activity
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-xs font-medium">Fetching dashboard telemetry…</p>
          </div>
        )}

        {error && (
          <div className="glass-card rounded-3xl p-6 text-destructive border border-destructive/40 bg-destructive/10">
            <AlertTriangle className="mb-2 h-5 w-5" />
            <p className="text-xs font-semibold">
              {error instanceof Error ? error.message : "Could not load dashboard data"}
            </p>
          </div>
        )}

        {data && (
          <>
            {/* Dashboard Metric Widgets Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Plan Status */}
              <motion.div
                whileHover={{ y: -4 }}
                className="glass-card flex flex-col justify-between rounded-3xl p-6 border border-border/60 bg-card/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Plan Tier</span>
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-3xl font-extrabold capitalize text-foreground">
                      {data.credits.plan}
                    </span>
                    {data.credits.plan === "pro" ? (
                      <span className="rounded-full bg-gradient-brand px-2.5 py-0.5 text-[10px] font-extrabold text-primary-foreground shadow-glow">
                        PRO
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted border border-border/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        STARTER
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {data.credits.plan === "pro" ? "Unlimited processing access" : "5 free images per day"}
                  </p>
                </div>
                {data.credits.plan === "free" && (
                  <Button asChild variant="outline" size="sm" className="mt-5 w-full rounded-xl border-primary/40 text-primary hover:bg-primary/10 text-xs font-semibold">
                    <Link to="/billing">
                      Upgrade to Pro <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </motion.div>

              {/* Card 2: Today's Usage */}
              <motion.div
                whileHover={{ y: -4 }}
                className="glass-card flex flex-col justify-between rounded-3xl p-6 border border-border/60 bg-card/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Daily Quota</span>
                    <Zap className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="mt-4 text-3xl font-extrabold text-foreground">
                    {data.credits.daily_used}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      / {data.credits.plan === "pro" ? "∞" : data.credits.daily_limit}
                    </span>
                  </div>
                  {data.credits.plan !== "pro" && (
                    <Progress
                      value={(data.credits.daily_used / data.credits.daily_limit) * 100}
                      className="mt-4 h-2 bg-muted rounded-full"
                    />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-4">
                  Resets every 24 hours automatically.
                </p>
              </motion.div>

              {/* Card 3: Pack Credits */}
              <motion.div
                whileHover={{ y: -4 }}
                className="glass-card flex flex-col justify-between rounded-3xl p-6 border border-border/60 bg-card/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Pack Credits</span>
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                  <div className="mt-4 text-3xl font-extrabold text-foreground">{data.credits.pack_credits}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Pay-as-you-go credits</p>
                </div>
                <div className="mt-4 rounded-xl bg-background/40 border border-border/40 p-2.5 text-[11px] text-muted-foreground">
                  Never expire · Rollover allowed
                </div>
              </motion.div>
            </div>

            {/* Quick Upload CTA Widget */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/60 bg-gradient-brand-soft flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Ready to remove a background?</h3>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop JPG, PNG, or WEBP files in workspace.
                  </p>
                </div>
              </div>
              <Button asChild className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 text-xs font-bold py-5 px-6 rounded-xl transition-all shrink-0">
                <Link to="/app">Start Uploading</Link>
              </Button>
            </div>

            {/* Recent Uploads Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Recent Uploads Telemetry</h2>
                <span className="text-xs text-muted-foreground">Auto-cleared after 24h</span>
              </div>

              {data.uploads.length === 0 ? (
                <EmptyState
                  icon={ImageOff}
                  title="No Recent Uploads"
                  description="Process your first image in the workspace to see processing logs here."
                  actionLabel="Open Studio Workspace"
                  onAction={() => window.location.assign("/app")}
                  actionIcon={Wand2}
                  className="py-12"
                />
              ) : (
                <div className="glass-card overflow-hidden rounded-3xl border border-border/60 divide-y divide-border/40 bg-card/40">
                  {data.uploads.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-4 p-4 text-xs hover:bg-card/70 transition-colors"
                    >
                      <div className="min-w-0 flex-1 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted border border-border/40 text-muted-foreground shrink-0">
                          <Wand2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-foreground">
                            {u.original_filename ?? "image"}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3 text-primary" />
                            {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })} · expires{" "}
                            {formatDistanceToNow(new Date(u.expires_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={u.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400">
        <Check className="h-3.5 w-3.5" /> Done
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1 text-[11px] font-bold text-destructive">
        <AlertTriangle className="h-3.5 w-3.5" /> Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border/50 px-3 py-1 text-[11px] font-bold text-muted-foreground">
      <Loader2 className="h-3.5 w-3.5 animate-spin" /> {status}
    </span>
  );
}