import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/dashboard.functions";
import { Check, Sparkles, Zap, Shield, HelpCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Plans — SnapCut AI" },
      { name: "description", content: "Manage your credits, view plan details, or upgrade to Pro." },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });

  const dailyUsed = data?.credits?.daily_used ?? 0;
  const dailyLimit = data?.credits?.daily_limit ?? 5;
  const packCredits = data?.credits?.pack_credits ?? 0;
  const currentPlan = data?.credits?.plan ?? "free";

  const plans = [
    {
      name: "Free Starter",
      tagline: "Perfect for testing and occasional use.",
      price: "$0",
      period: "forever",
      popular: false,
      features: [
        "5 Free removals every single day",
        "HD Transparent PNG exports",
        "Standard processing speed",
        "24-hour temporary storage",
        "Community support",
      ],
      cta: "Current Plan",
      current: currentPlan === "free",
    },
    {
      name: "Pro Unlimited",
      tagline: "For professionals, ecommerce & designers.",
      price: billingCycle === "annual" ? "$12" : "$15",
      period: "/ month",
      popular: true,
      features: [
        "Unlimited AI background removals",
        "Maximum resolution 4K output",
        "Priority Ultra-fast processing engine",
        "Bulk batch processing",
        "Unlimited cloud history storage",
        "24/7 Priority support",
      ],
      cta: "Upgrade to Pro",
      current: currentPlan === "pro",
    },
    {
      name: "Credit Pack",
      tagline: "Pay as you go. Credits never expire.",
      price: "$9",
      period: "one-time",
      popular: false,
      features: [
        "100 High-resolution removals",
        "Never expires — use anytime",
        "Full commercial rights",
        "No monthly commitment",
      ],
      cta: "Buy 100 Credits",
      current: false,
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Billing & Usage Overview
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Plans & Subscriptions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Monitor your credit allocation or upgrade to unlocked unlimited HD AI processing.
          </p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="glass-card mb-12 rounded-3xl p-6 sm:p-8 border border-border/60 bg-card/60 shadow-xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-brand opacity-15 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  Current Plan
                </span>
                <span className="rounded-full bg-gradient-brand px-2.5 py-0.5 text-xs font-bold text-primary-foreground capitalize shadow-glow">
                  {currentPlan}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground capitalize">
                {currentPlan === "pro" ? "Pro Unlimited Plan" : "Free Starter Plan"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Your daily quota resets automatically every 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-8 bg-background/40 p-4 rounded-2xl border border-border/40">
              <div>
                <div className="text-xs text-muted-foreground font-medium">Daily Limit</div>
                <div className="text-xl font-bold text-foreground mt-0.5">
                  {dailyUsed} / {currentPlan === "pro" ? "∞" : dailyLimit}
                </div>
                {currentPlan !== "pro" && (
                  <Progress value={(dailyUsed / dailyLimit) * 100} className="mt-2 h-1.5 w-28 bg-muted" />
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">Pack Credits</div>
                <div className="text-xl font-bold text-foreground mt-0.5">{packCredits}</div>
                <span className="text-[10px] text-muted-foreground">Never expire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1 rounded-2xl bg-card/80 p-1.5 border border-border/60 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-5 py-2 text-xs font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-brand text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold transition-all ${
                billingCycle === "annual"
                  ? "bg-gradient-brand text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual Billing
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Tier Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              className={`glass-card relative flex flex-col rounded-3xl p-8 border transition-all duration-300 ${
                plan.popular
                  ? "border-primary/50 shadow-glow bg-card/80"
                  : "border-border/60 bg-card/40 hover:border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-primary-foreground uppercase shadow-glow">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground min-h-[32px]">
                  {plan.tagline}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{plan.period}</span>
                </div>
              </div>

              <div className="mb-8 flex-1 space-y-3">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Included Features:
                </div>
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <Button
                disabled={plan.current}
                className={`w-full py-6 text-sm font-semibold rounded-2xl transition-all ${
                  plan.popular
                    ? "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95"
                    : "bg-muted/80 hover:bg-muted text-foreground"
                }`}
              >
                {plan.current ? "Current Plan" : plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-16 glass-card rounded-2xl p-6 text-center border border-border/40 max-w-2xl mx-auto flex flex-col items-center">
          <Shield className="h-8 w-8 text-primary mb-2" />
          <h4 className="font-bold text-foreground text-sm">Cancel or Adjust Anytime</h4>
          <p className="text-xs text-muted-foreground mt-1">
            All subscriptions come with transparent usage tracking and zero lock-in contracts.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
