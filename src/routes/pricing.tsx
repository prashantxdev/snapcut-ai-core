import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — SnapCut AI" },
      { name: "description", content: "Free forever for 5 images/day. Pro for unlimited. Credit packs for occasional bursts." },
      { property: "og:title", content: "Pricing — SnapCut AI" },
      { property: "og:description", content: "Simple, transparent pricing for background removal." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["5 images per day", "HD output", "Transparent PNGs", "24h auto-delete"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    features: ["Unlimited images", "Priority GPU processing", "4K Ultra HD output", "24/7 Priority support"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Credit Pack",
    price: "$9",
    period: "/ 100 images",
    features: ["100 image credits", "Never expire", "Stack with Free plan", "Pay-as-you-go flexibility"],
    cta: "Buy Credit Pack",
    highlighted: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-grid-pattern">
      <SiteHeader />
      <section className="bg-gradient-hero py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent Pricing Structure
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Simple, <span className="text-gradient-brand">transparent</span> pricing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Start free. Upgrade only when you need more speed and capacity.
          </p>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -4 }}
              className={`glass-card relative flex flex-col rounded-3xl p-8 border transition-all duration-300 ${
                t.highlighted ? "border-primary/50 shadow-glow bg-card/80" : "border-border/60 bg-card/40"
              }`}
            >
              {t.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground shadow-glow">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">{t.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">{t.price}</span>
                <span className="text-xs font-medium text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-8 space-y-3.5 text-xs text-muted-foreground flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full py-6 rounded-2xl font-bold text-xs transition-all ${
                  t.highlighted
                    ? "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95"
                    : "bg-muted/80 hover:bg-muted text-foreground"
                }`}
              >
                <Link to="/auth" search={{ mode: "signup" }}>{t.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}