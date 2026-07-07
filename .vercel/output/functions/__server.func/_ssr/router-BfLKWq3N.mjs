import { i as __toESM } from "../_runtime.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, j as redirect, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as objectType, t as enumType } from "../_libs/zod.mjs";
import { r as mockStorage } from "./mock-client-DjPvGP23.mjs";
import { t as supabase } from "./client-DAPlUHim.mjs";
import { t as snapcut_logo_default } from "./snapcut-logo-B6N_ChDM.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BfLKWq3N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-HVbwsiW2.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SnapCut AI — Remove image backgrounds in one click" },
			{
				name: "description",
				content: "AI-powered background removal. Drag, drop, done — transparent PNGs in seconds."
			},
			{
				name: "author",
				content: "SnapCut AI"
			},
			{
				name: "theme-color",
				content: "#020617"
			},
			{
				property: "og:title",
				content: "SnapCut AI — Remove image backgrounds in one click"
			},
			{
				property: "og:description",
				content: "AI-powered background removal. Drag, drop, done."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "SnapCut AI"
			},
			{
				name: "twitter:description",
				content: "Remove image backgrounds in one click."
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: snapcut_logo_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			theme: "dark",
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$9 = () => import("./terms-CeGsPgXT.mjs");
var Route$10 = createFileRoute("/terms")({
	head: () => ({ meta: [
		{ title: "Terms of Service — SnapCut AI" },
		{
			name: "description",
			content: "Terms governing your use of SnapCut AI."
		},
		{
			property: "og:title",
			content: "Terms of Service — SnapCut AI"
		},
		{
			property: "og:description",
			content: "Terms governing your use of SnapCut AI."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./reset-password-B1w97mZm.mjs");
var Route$9 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — SnapCut AI" }, {
		name: "description",
		content: "Set a new password for your SnapCut AI account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./privacy-ClAWkgnx.mjs");
var Route$8 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: "Privacy Policy — SnapCut AI" },
		{
			name: "description",
			content: "How SnapCut AI handles your images and personal data."
		},
		{
			property: "og:title",
			content: "Privacy Policy — SnapCut AI"
		},
		{
			property: "og:description",
			content: "Privacy practices for SnapCut AI users."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./pricing-BFsmbgIo.mjs");
var Route$7 = createFileRoute("/pricing")({
	head: () => ({ meta: [
		{ title: "Pricing — SnapCut AI" },
		{
			name: "description",
			content: "Free forever for 5 images/day. Pro for unlimited. Credit packs for occasional bursts."
		},
		{
			property: "og:title",
			content: "Pricing — SnapCut AI"
		},
		{
			property: "og:description",
			content: "Simple, transparent pricing for background removal."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./features-BpwI-3d4.mjs");
var Route$6 = createFileRoute("/features")({
	head: () => ({ meta: [
		{ title: "Features — SnapCut AI" },
		{
			name: "description",
			content: "AI-precise edges, sub-5-second processing, private storage, and HD output."
		},
		{
			property: "og:title",
			content: "Features — SnapCut AI"
		},
		{
			property: "og:description",
			content: "Everything SnapCut AI does to ship cleaner visuals faster."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./auth-i0JmHHZN.mjs");
var searchSchema = objectType({ mode: enumType(["signin", "signup"]).optional() });
var Route$5 = createFileRoute("/auth")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Sign in — SnapCut AI" }, {
		name: "description",
		content: "Sign in or create your SnapCut AI account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./route-Di7iQBCH.mjs");
var Route$4 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./routes-CQ1sGyye.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "SnapCut AI — Remove image backgrounds in one click" },
		{
			name: "description",
			content: "AI-powered background removal that delivers transparent PNGs in under 5 seconds. 5 free images daily."
		},
		{
			property: "og:title",
			content: "SnapCut AI — Remove image backgrounds in one click"
		},
		{
			property: "og:description",
			content: "AI-powered background removal that delivers transparent PNGs in under 5 seconds."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./dashboard-Xp5jtCSd.mjs");
var Route$2 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — SnapCut AI" }, {
		name: "description",
		content: "Your credits, plan, and recent uploads."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./app-xvnFu77Y.mjs");
var Route$1 = createFileRoute("/_authenticated/app")({
	head: () => ({ meta: [{ title: "Workspace — SnapCut AI" }, {
		name: "description",
		content: "Upload an image and get a transparent PNG in seconds."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/mock-storage/download")({ server: { handlers: { GET: async ({ request }) => {
	const path = new URL(request.url).searchParams.get("path");
	if (!path) return new Response("Missing path", { status: 400 });
	const file = await mockStorage.get(path);
	if (!file) return new Response("Not found", { status: 404 });
	return new Response(file.bytes, { headers: {
		"Content-Type": file.contentType,
		"Content-Length": file.bytes.length.toString(),
		"Cache-Control": "public, max-age=3600",
		"Access-Control-Allow-Origin": "*"
	} });
} } } });
var TermsRoute = Route$10.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$11
});
var ResetPasswordRoute = Route$9.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$11
});
var PrivacyRoute = Route$8.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$11
});
var PricingRoute = Route$7.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$11
});
var FeaturesRoute = Route$6.update({
	id: "/features",
	path: "/features",
	getParentRoute: () => Route$11
});
var AuthRoute = Route$5.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$11
});
var AuthenticatedRouteRoute = Route$4.update({
	id: "/_authenticated",
	getParentRoute: () => Route$11
});
var IndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AuthenticatedDashboardRoute = Route$2.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppRoute = Route$1.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiMockStorageDownloadRoute = Route.update({
	id: "/api/mock-storage/download",
	path: "/api/mock-storage/download",
	getParentRoute: () => Route$11
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAppRoute,
	AuthenticatedDashboardRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	FeaturesRoute,
	PricingRoute,
	PrivacyRoute,
	ResetPasswordRoute,
	TermsRoute,
	ApiMockStorageDownloadRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
