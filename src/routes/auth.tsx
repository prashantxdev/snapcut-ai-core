import { createFileRoute, useNavigate, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — SnapCut AI" },
      { name: "description", content: "Sign in or create your SnapCut AI account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/app", replace: true });
    }
  }, [user, session, authLoading, navigate]);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data: exists, error: checkError } = await supabase.rpc('check_user_exists', { email_to_check: email });
        
        if (checkError) {
          console.error("[Auth] Check user exists RPC notice:", checkError.message);
        }
        
        if (exists) {
          toast.error("This email is already registered. Please sign in.");
          setMode("signin");
          setLoading(false);
          return;
        }

        const signupResponse = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/app" },
        });
        
        if (signupResponse.error) {
          throw signupResponse.error;
        }

        if (signupResponse.data?.session) {
          toast.success("Account created! Logging you in...");
          navigate({ to: "/app" });
        } else {
          const signInResponse = await supabase.auth.signInWithPassword({ email, password });
          
          if (signInResponse.error) {
            toast.success("Account created successfully! Please sign in with your password.");
            setMode("signin");
          } else {
            toast.success("Account created successfully! Logging you in...");
            navigate({ to: "/app" });
          }
        }
      } else {
        const signinResponse = await supabase.auth.signInWithPassword({ email, password });
        
        if (signinResponse.error) {
          throw signinResponse.error;
        }
        
        toast.success("Signed in successfully!");
        navigate({ to: "/app" });
      }
    } catch (err: any) {
      console.error("[Auth] Captured error in handleEmail:", err);
      
      let friendlyMessage = "Something went wrong.";
      const message = err.message || "";
      const status = err.status;

      if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
        friendlyMessage = "Network error. Please check your internet connection.";
      } else if (message.includes("Email not confirmed") || message.includes("Email not verified")) {
        friendlyMessage = "Email not verified. Please check your inbox to confirm your account.";
      } else if (message === "Invalid login credentials" || status === 400) {
        try {
          const { data: exists } = await supabase.rpc('check_user_exists', { email_to_check: email });
          if (exists === false) {
            friendlyMessage = "User does not exist. Please sign up first.";
          } else {
            friendlyMessage = "Incorrect password. Please try again.";
          }
        } catch (checkErr) {
          friendlyMessage = "Incorrect password.";
        }
      } else if (message.includes("already registered") || message.includes("already exists")) {
        friendlyMessage = "This email is already registered. Please sign in.";
      } else {
        friendlyMessage = message;
      }
      
      toast.error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) {
      toast.error("Enter your email above, then click reset.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent.");
  }

  return (
    <div className="flex min-h-screen bg-gradient-hero bg-grid-pattern items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card relative rounded-3xl p-8 border border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <h1 className="text-center text-2xl font-extrabold text-foreground">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "Sign in to access your studio workspace" : "Get 5 free AI image removals every day"}
          </p>

          <form onSubmit={handleEmail} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="name@company.com"
                className="mt-1 w-full rounded-xl border-input bg-background/60 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border-input bg-background/60 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 py-5 rounded-xl font-bold text-xs transition-all cursor-pointer"
              disabled={loading || googleLoading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign In to Studio" : "Create Account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/80 px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full py-5 rounded-xl font-semibold text-xs border-border/60 hover:bg-muted/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="hover:text-foreground font-semibold transition-colors"
            >
              {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
            {mode === "signin" && (
              <button onClick={handleReset} className="hover:text-foreground transition-colors">
                Forgot password?
              </button>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}