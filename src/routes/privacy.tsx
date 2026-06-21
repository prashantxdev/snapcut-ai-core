import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SnapCut AI" },
      { name: "description", content: "How SnapCut AI handles your images and personal data." },
      { property: "og:title", content: "Privacy Policy — SnapCut AI" },
      { property: "og:description", content: "Privacy practices for SnapCut AI users." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted-foreground">
          <h2 className="mt-8 text-lg font-semibold text-foreground">Images you upload</h2>
          <p>Images are stored in encrypted private storage and automatically deleted 24 hours after upload. We do not use your images to train models. Only you can access your uploads and results through signed URLs scoped to your account.</p>
          <h2 className="mt-6 text-lg font-semibold text-foreground">Account data</h2>
          <p>We collect your email and authentication identifiers required to operate the service. We do not sell your data.</p>
          <h2 className="mt-6 text-lg font-semibold text-foreground">Third parties</h2>
          <p>Background removal is performed by a third-party AI provider. Images are transmitted over TLS and not retained by the provider beyond the duration of the request.</p>
          <h2 className="mt-6 text-lg font-semibold text-foreground">Contact</h2>
          <p>Questions? Reach out via the contact channel on your account.</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}