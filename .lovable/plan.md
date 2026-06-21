
# SnapCut AI — Build Plan

## Stack Adaptation (important)

Your spec assumes Vite + n8n + Cloudinary + Vercel. This project runs on **TanStack Start (Cloudflare Workers)** with **Lovable Cloud** (Supabase under the hood). I'll adapt while keeping all functional behavior:

| Spec | Adapted to |
|---|---|
| React (Vite) | TanStack Start (React + TS + Tailwind + shadcn) — same DX, with SSR + SEO baked in |
| n8n Cloud workflows | TanStack server functions + a public webhook route (`/api/public/webhooks/razorpay`) — same orchestration, no extra hosting |
| Cloudinary temp storage | Lovable Cloud Storage + 24h auto-delete cron — no third party needed |
| Supabase direct | Lovable Cloud (Supabase under the hood) — auth, Postgres, RLS, storage |
| Razorpay | Razorpay Orders API + Checkout + webhook handler in TSS |
| Vercel hosting | Lovable publish (Cloudflare Workers) |

**Required secrets (I'll request after MVP scaffold):**
- `REMOVEBG_API_KEY` (defaulting to Remove.bg — easiest, swappable behind a provider interface)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

## Phasing

This spec is ~10 distinct surfaces. Shipping all of it in one turn produces rough edges and burns credits. I'll deliver in **3 phases**, each independently deployable. You can stop after any phase.

### Phase 1 — Core MVP (this build)
The product loop end-to-end, monetization-ready.

- **Design system**: dark neon theme from the logo (`#0EA5FF` / `#22D3EE` / `#C084FC` on `#020617`), Inter font, glassmorphism cards, gradient CTAs, neon glow, semantic tokens in `src/styles.css`
- **Logo**: upload provided image via `lovable-assets`, use in header/favicon
- **Public pages**: Landing (hero + live demo + features + pricing teaser), Features, Pricing, Privacy, Terms — each its own route with unique SEO `head()`
- **Auth**: Lovable Cloud email/password + Google OAuth, `/auth`, password reset at `/reset-password`, integration-managed `_authenticated` gate
- **Upload workspace** (`/_authenticated/app`):
  - Drag/drop + browse, client-side validation (≤10MB, ≤5000×5000, JPG/PNG/WEBP) via Zod
  - Upload to Cloud Storage (`uploads` bucket, private)
  - Server fn calls Remove.bg, writes result to `results` bucket, inserts `uploads` row
  - Preview with checkerboard background, download button, processing state with progress + skeleton
- **Dashboard** (`/_authenticated/dashboard`): credits remaining, today's usage, recent 7-day history grid, plan badge
- **Credits enforcement**: free = 5/day, Pro = unlimited; checked server-side in the processing fn
- **24h auto-delete**: Postgres function + scheduled trigger to purge expired storage objects + rows
- **Toasts, error boundaries, mobile responsive, WCAG-AA contrast**

### Phase 2 — Billing & Account
- Razorpay integration: create-order server fn, Checkout component, signature-verified webhook at `/api/public/webhooks/razorpay`
- Plans: Pro Monthly subscription + Credit Packs
- Pages: Billing, Credits, Account Settings, Downloads history
- Transactions table + receipts

### Phase 3 — Admin & B2B API
- Admin panel (role-gated via `has_role`): users, usage analytics, revenue, error logs
- Public B2B API: `api_keys` table, hashed keys, rate limiting via Postgres, `/api/public/v1/remove-bg` endpoint, API Docs page
- Blog, About, Contact pages

---

## Phase 1 Technical Details

### Database (migration)
Tables (all with explicit GRANTs, RLS, policies scoped to `auth.uid()`):
- `profiles` — id (FK auth.users), display_name, avatar_url, created_at; auto-created via trigger
- `uploads` — id, user_id, original_url, result_url, original_size, status (`pending|processing|done|failed`), error, expires_at (now+24h), created_at
- `credits` — user_id PK, plan (`free|pro`), daily_used, daily_reset_at, pack_credits
- `app_role` enum + `user_roles` + `has_role()` security definer (per platform spec)

Storage buckets (private): `uploads`, `results`. RLS via `storage.objects` policies keyed to `auth.uid()` in path prefix.

Scheduled cleanup: `pg_cron` job hourly → delete expired rows + storage objects.

### Server functions (`src/lib/*.functions.ts`)
- `processImage` — auth-required; validates credits, downloads from storage, calls Remove.bg, uploads result, inserts row, decrements credits
- `getDashboard` — auth-required; returns credits + recent uploads
- `getSignedUploadUrl` — auth-required; returns signed upload URL for direct browser → storage

Provider abstraction in `src/lib/bg-removal.server.ts` so Phase-2 swap to ClipDrop/Photoroom is one file.

### Routes
```
src/routes/
  __root.tsx               (existing; update meta + favicon)
  index.tsx                Landing
  features.tsx
  pricing.tsx
  privacy.tsx
  terms.tsx
  auth.tsx                 Login + Signup tabs + Google
  reset-password.tsx
  _authenticated/
    route.tsx              (integration-managed)
    dashboard.tsx
    app.tsx                Upload workspace
```

### Components (`src/components/`)
- `SiteHeader`, `SiteFooter`, `Logo`
- `UploadDropzone`, `ResultPreview`, `CreditMeter`, `PlanBadge`
- `HeroDemo` (landing), `FeatureCard`, `PricingTable`

### Out of Phase 1 (deferred to Phase 2/3)
- Razorpay, Admin, B2B API, Blog, API Docs, Contact, About, API Keys page, Email verification UI (Supabase handles it, no custom page needed for MVP)

---

## After Phase 1 I will

1. Ask you to provide the **Remove.bg API key** (or confirm a different provider)
2. Confirm phasing — proceed to Phase 2 (billing) or stop
