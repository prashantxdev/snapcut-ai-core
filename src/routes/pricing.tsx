import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    features: ["Unlimited images", "Priority processing", "HD output", "Email support"],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    name: "Credit Pack",
    price: "$9",
    period: "/ 100 images",
    features: ["100 image credits", "Never expire", "Stack with Free plan", "Great for bursts"],
    cta: "Buy pack",
    highlighted: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Simple, <span className="text-gradient-brand">transparent</span> pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade only when you need more.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`glass relative rounded-2xl p-8 ${
                t.highlighted ? "border-primary/50 shadow-glow" : ""
              }`}
            >
              {t.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full ${
                  t.highlighted
                    ? "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90"
                    : ""
                }`}
                variant={t.highlighted ? "default" : "outline"}
              >
                <Link to="/auth" search={{ mode: "signup" }}>{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Billing launches in our next release. Free tier is live today.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}