import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Zap, Shield, Image, Layers, Download, Clock, Sparkles, Lock } from "lucide-react";

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
  { icon: Zap, title: "Sub-5-second processing", desc: "Optimized inference pipeline produces results almost instantly." },
  { icon: Image, title: "Pixel-perfect cutouts", desc: "Hair, fur, and translucent edges preserved with sub-pixel precision." },
  { icon: Layers, title: "Transparent PNG output", desc: "Drop straight into Figma, Photoshop, or your storefront." },
  { icon: Download, title: "HD downloads", desc: "Up to 5000×5000 — print and ecommerce ready." },
  { icon: Clock, title: "24h auto-delete", desc: "Your images never linger. Storage is purged automatically." },
  { icon: Sparkles, title: "Drag & drop workspace", desc: "Built for speed. Process one image or batches without friction." },
  { icon: Shield, title: "Encrypted in transit", desc: "TLS everywhere. Your visuals stay yours." },
  { icon: Lock, title: "Private by default", desc: "Signed URLs, scoped access — only you can see your uploads." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Every feature, focused on <span className="text-gradient-brand">one thing</span>.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Removing backgrounds — beautifully, fast, and privately.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 transition-shadow hover:shadow-glow">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}