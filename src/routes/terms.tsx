import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SnapCut AI" },
      { name: "description", content: "Terms governing your use of SnapCut AI." },
      { property: "og:title", content: "Terms of Service — SnapCut AI" },
      { property: "og:description", content: "Terms governing your use of SnapCut AI." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted-foreground">
          <h2 className="mt-8 text-lg font-semibold text-foreground">Acceptable use</h2>
          <p>You must own — or have permission to process — every image you upload. Do not upload illegal content or content depicting minors in inappropriate contexts.</p>
          <h2 className="mt-6 text-lg font-semibold text-foreground">Limits</h2>
          <p>Max file size 10 MB; max resolution 5000×5000; supported formats JPG, PNG, WEBP. Free accounts may process up to 5 images per day.</p>
          <h2 className="mt-6 text-lg font-semibold text-foreground">Availability</h2>
          <p>We aim for 99.5% uptime but provide the service on an as-is basis without warranty of any kind.</p>
          <h2 className="mt-6 text-lg font-semibold text-foreground">Termination</h2>
          <p>We may suspend accounts that abuse the service or violate these terms.</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}