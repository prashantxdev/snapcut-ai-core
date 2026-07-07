import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Sparkles, f as Layers, g as Download, l as Lock, o as Shield, p as Image, t as Zap, v as Clock } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-CnPwCPAI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/features-BpwI-3d4.js
var import_jsx_runtime = require_jsx_runtime();
var features = [
	{
		icon: Zap,
		title: "Sub-5-second processing",
		desc: "Optimized inference pipeline produces results almost instantly."
	},
	{
		icon: Image,
		title: "Pixel-perfect cutouts",
		desc: "Hair, fur, and translucent edges preserved with sub-pixel precision."
	},
	{
		icon: Layers,
		title: "Transparent PNG output",
		desc: "Drop straight into Figma, Photoshop, or your storefront."
	},
	{
		icon: Download,
		title: "HD downloads",
		desc: "Up to 5000×5000 — print and ecommerce ready."
	},
	{
		icon: Clock,
		title: "24h auto-delete",
		desc: "Your images never linger. Storage is purged automatically."
	},
	{
		icon: Sparkles,
		title: "Drag & drop workspace",
		desc: "Built for speed. Process one image or batches without friction."
	},
	{
		icon: Shield,
		title: "Encrypted in transit",
		desc: "TLS everywhere. Your visuals stay yours."
	},
	{
		icon: Lock,
		title: "Private by default",
		desc: "Signed URLs, scoped access — only you can see your uploads."
	}
];
function FeaturesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-gradient-hero py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl px-4 text-center sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-4xl font-extrabold tracking-tight md:text-5xl",
						children: [
							"Every feature, focused on ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient-brand",
								children: "one thing"
							}),
							"."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-lg text-muted-foreground",
						children: "Removing backgrounds — beautifully, fast, and privately."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4",
					children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-6 transition-shadow hover:shadow-glow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: f.desc
							})
						]
					}, f.title))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { FeaturesPage as component };
