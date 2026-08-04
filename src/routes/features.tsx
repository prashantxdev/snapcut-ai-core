import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Zap, Shield, Image, Layers, Download, Clock, Sparkles, Lock } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — SnapCut AI" },
      { name: "description", content: "AI-precise edges, sub-5-second processing, private storage, and HD output." },
      { property: "og:title", content: "Features — SnapCut AI" },
      { property: "og:description", content: "Everything SnapCut AI does to ship cleaner visuals faster." },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  { icon: Zap, title: "Sub-5-Second Processing", desc: "Optimized inference pipeline produces transparent PNGs almost instantly." },
  { icon: Image, title: "Pixel-Perfect Edge Cutouts", desc: "Hair, fur, and translucent edges preserved with sub-pixel alpha matted accuracy." },
  { icon: Layers, title: "Transparent PNG Output", desc: "Ready to drop straight into Figma, Photoshop, Canva, or product storefronts." },
  { icon: Download, title: "4K Ultra HD Export", desc: "Supports up to 5000×5000 resolution output ready for print and web." },
  { icon: Clock, title: "24-Hour Auto Purge", desc: "Your images never linger on servers. Storage is purged automatically." },
  { icon: Sparkles, title: "Drag & Drop Workspace", desc: "Built for speed. Drag & drop images with instant side-by-side comparison." },
  { icon: Shield, title: "Encrypted Data Transmission", desc: "TLS encryption everywhere. Your visual assets stay 100% private." },
  { icon: Lock, title: "Private Scoped Storage", desc: "Signed storage URLs — only you can view or download your processed images." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-grid-pattern">
      <SiteHeader />
      <section className="bg-gradient-hero py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Cutting-Edge Capabilities
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Every feature, focused on <span className="text-gradient-brand">one thing</span>.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Removing image backgrounds — beautifully, fast, and privately.
          </p>
        </div>
      </section>

      <section className="py-16 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -4 }}
              className="glass-card rounded-3xl p-6 border border-border/60 bg-card/40 hover:border-primary/40 transition-all duration-300"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}