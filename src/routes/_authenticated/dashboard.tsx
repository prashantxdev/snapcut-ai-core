import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/dashboard.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wand2, ImageOff, Check, Loader2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your credits and recent activity</p>
          </div>
          <Button asChild className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/app"><Wand2 className="mr-1 h-4 w-4" /> Open workspace</Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
          </div>
        )}
        {error && (
          <div className="glass rounded-2xl p-6 text-destructive">
            <AlertTriangle className="mb-2 h-5 w-5" />
            {error instanceof Error ? error.message : "Could not load dashboard"}
          </div>
        )}

        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Plan</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-2xl font-bold capitalize">{data.credits.plan}</span>
                  {data.credits.plan === "pro" && (
                    <span className="rounded-full bg-gradient-brand px-2 py-0.5 text-xs font-semibold text-primary-foreground">PRO</span>
                  )}
                </div>
                {data.credits.plan === "free" && (
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link to="/pricing">Upgrade</Link>
                  </Button>
                )}
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Today</div>
                <div className="mt-2 text-2xl font-bold">
                  {data.credits.daily_used} <span className="text-sm font-normal text-muted-foreground">/ {data.credits.plan === "pro" ? "∞" : data.credits.daily_limit}</span>
                </div>
                {data.credits.plan !== "pro" && (
                  <Progress
                    value={(data.credits.daily_used / data.credits.daily_limit) * 100}
                    className="mt-3 h-2"
                  />
                )}
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Pack credits</div>
                <div className="mt-2 text-2xl font-bold">{data.credits.pack_credits}</div>
                <p className="mt-1 text-xs text-muted-foreground">Never expire</p>
              </div>
            </div>

            <h2 className="mb-3 mt-10 text-lg font-semibold">Recent uploads</h2>
            {data.uploads.length === 0 ? (
              <div className="glass flex flex-col items-center rounded-2xl p-10 text-center">
                <ImageOff className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-medium">No uploads yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Process your first image to see it here.</p>
                <Button asChild className="mt-4 bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
                  <Link to="/app">Open workspace</Link>
                </Button>
              </div>
            ) : (
              <div className="glass divide-y divide-border/50 overflow-hidden rounded-2xl">
                {data.uploads.map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{u.original_filename ?? "image"}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })} · expires {formatDistanceToNow(new Date(u.expires_at), { addSuffix: true })}
                      </div>
                    </div>
                    <StatusBadge status={u.status} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-medium text-secondary">
        <Check className="h-3 w-3" /> Done
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/20 px-2.5 py-1 text-xs font-medium text-destructive">
        <AlertTriangle className="h-3 w-3" /> Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Loader2 className="h-3 w-3 animate-spin" /> {status}
    </span>
  );
}