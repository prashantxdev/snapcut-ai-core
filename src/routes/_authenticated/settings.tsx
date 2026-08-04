import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { clearHistory, clearActiveState } from "@/lib/storage";
import { useState } from "react";
import { toast } from "sonner";
import {
  User,
  ShieldAlert,
  KeyRound,
  Loader2,
  LogOut,
  Trash2,
  AlertTriangle,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings — SnapCut AI" },
      { name: "description", content: "Manage your profile preferences and security credentials." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, signOut } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete Account Confirmation Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await clearHistory();
      await clearActiveState();
      toast.success("Account data cleared. Signing you out...");
      await signOut();
    } catch (err) {
      console.error("Error deleting account data:", err);
      toast.error("Failed to delete account data");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3 backdrop-blur-md">
            <User className="h-3.5 w-3.5" />
            Account Management
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View your profile details, update security credentials, and manage your account settings.
          </p>
        </div>

        {/* 1. Profile Overview Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/60 bg-card/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary shadow-glow">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Profile Overview</h2>
              <p className="text-xs text-muted-foreground">Your account identification details</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl bg-background/40 border border-border/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-2xl font-extrabold text-primary-foreground shadow-glow">
              {userInitial}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-base font-bold text-foreground truncate">{user?.email}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>User ID: <code className="text-[11px] bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{user?.id?.slice(0, 12)}…</code></span>
                <span>•</span>
                <span>Member since {createdDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Password & Security Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/60 bg-card/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary shadow-glow">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Password & Security</h2>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={updating}
              className="mt-2 bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 text-xs font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating…
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </div>

        {/* 3. Account Card (Normal Actions: Sign Out) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/60 bg-card/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary shadow-glow">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Account</h2>
              <p className="text-xs text-muted-foreground">Session management and preferences</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-background/40 border border-border/40">
            <div>
              <h3 className="text-sm font-bold text-foreground">Sign Out</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sign out of your current session securely.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="rounded-xl border-border/60 text-foreground hover:bg-accent/40 text-xs font-semibold cursor-pointer shrink-0 transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* 4. Danger Zone Card (Destructive Actions: Delete Account) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-destructive">Danger Zone</h2>
              <p className="text-xs text-muted-foreground">Irreversible account actions</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground">Delete Account</h3>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                Permanently delete your SnapCut AI account, upload history, and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer shrink-0 transition-all shadow-sm"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-destructive/40 bg-card shadow-2xl space-y-4 relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Delete Account Permanently?</h3>
                  <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed bg-destructive/10 p-3.5 rounded-2xl border border-destructive/20 text-foreground/90">
                Are you sure you want to delete your account? All your processed image history, saved preferences, and account data will be permanently wiped.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  disabled={deleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-xl text-xs font-semibold border-border/60 text-foreground hover:bg-accent/40"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={handleDeleteAccount}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold rounded-xl"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
