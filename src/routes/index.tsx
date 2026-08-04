import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, Image as ImageIcon, ArrowRight, Check, Layers, Cpu } from "lucide-react";
import logo from "@/assets/snapcut-logo.png";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-background text-foreground bg-grid-pattern">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by State-of-the-Art Neural Networks
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Remove backgrounds <br />
              in <span className="text-gradient-brand">one click</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Drag, drop, done. SnapCut AI produces clean, subpixel-accurate transparent PNGs in seconds — perfect for ecommerce, marketing, and design.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 font-bold py-6 px-8 rounded-2xl transition-all"
              >
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start Free — 5 Images Daily <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-border/60 text-foreground hover:bg-accent/40 font-semibold py-6 px-8"
              >
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Auto-deleted after 24h</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 4K Ultra HD output</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-gradient-brand opacity-25 blur-3xl pointer-events-none" />
            <div className="glass-card relative aspect-square w-full overflow-hidden rounded-3xl p-6 border border-border/60 bg-card/60 shadow-2xl">
              <div className="checker-bg flex h-full w-full items-center justify-center rounded-2xl border border-border/40 relative group">
                <img
                  src={logo}
                  alt="SnapCut AI demo"
                  className="h-3/4 w-3/4 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 rounded-full bg-background/80 border border-border/60 px-3 py-1 text-xs font-bold text-primary backdrop-blur-md shadow-md">
                  Transparent PNG Ready
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y border-border/40 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
              Built for speed, precision, and performance
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Enterprise-grade AI background extraction designed for modern product workflows.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Under 5 Seconds Processing",
                desc: "Instant cloud execution optimized with custom GPU neural acceleration.",
              },
              {
                icon: Layers,
                title: "Subpixel Alpha Matting",
                desc: "Preserves fine details like hair strands, glass transparency, and complex edges.",
              },
              {
                icon: Shield,
                title: "Encrypted & Private",
                desc: "Your data is protected. All temporary uploaded images auto-expire after 24 hours.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card rounded-3xl p-8 border border-border/60 bg-card/40 hover:border-primary/40 transition-all duration-300"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="glass-card rounded-3xl p-10 sm:p-14 border border-border/60 bg-gradient-brand-soft shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl pointer-events-none" />

            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
              Ready to create cleaner visuals?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
              Join thousands of creators using SnapCut AI to produce high-impact transparent graphics.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 font-bold py-6 px-8 rounded-2xl transition-all"
              >
                <Link to="/auth" search={{ mode: "signup" }}>
                  Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
