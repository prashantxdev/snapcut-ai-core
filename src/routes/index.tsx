import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, Image as ImageIcon, ArrowRight, Check } from "lucide-react";
import logo from "@/assets/snapcut-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapCut AI — Remove image backgrounds in one click" },
      { name: "description", content: "AI-powered background removal that delivers transparent PNGs in under 5 seconds. 5 free images daily." },
      { property: "og:title", content: "SnapCut AI — Remove image backgrounds in one click" },
      { property: "og:description", content: "AI-powered background removal that delivers transparent PNGs in under 5 seconds." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              Powered by state-of-the-art AI
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Remove backgrounds <br />
              in <span className="text-gradient-brand">one click</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Drag, drop, done. SnapCut AI produces clean, transparent PNGs in seconds —
              perfect for ecommerce, marketing, and design.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start free — 5 images/day <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-secondary" /> No credit card</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-secondary" /> Auto-deleted in 24h</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-secondary" /> HD output</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass relative aspect-square w-full overflow-hidden rounded-3xl p-6">
              <div className="checker-bg flex h-full w-full items-center justify-center rounded-2xl">
                <img src={logo.url} alt="SnapCut AI demo" className="h-2/3 w-2/3 object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-y border-border/40 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for speed and precision</h2>
            <p className="mt-3 text-muted-foreground">Everything you need. Nothing you don't.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "Under 5 seconds", desc: "From upload to transparent PNG. Optimized AI pipeline." },
              { icon: ImageIcon, title: "Pixel-perfect edges", desc: "Hair, fur, fine details — preserved with subpixel accuracy." },
              { icon: Shield, title: "Private by default", desc: "Images are encrypted in transit and auto-deleted after 24 hours." },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 transition-shadow hover:shadow-glow">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to ship cleaner visuals?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/auth" search={{ mode: "signup" }}>
                Create your free account <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
