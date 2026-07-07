import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-sQyoalR3.mjs";
import { y as Check } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-LUylfG5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-Daf2VnTm.js
var import_jsx_runtime = require_jsx_runtime();
var tiers = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		features: [
			"5 images per day",
			"HD output",
			"Transparent PNGs",
			"24h auto-delete"
		],
		cta: "Get started",
		highlighted: false
	},
	{
		name: "Pro",
		price: "$12",
		period: "/month",
		features: [
			"Unlimited images",
			"Priority processing",
			"HD output",
			"Email support"
		],
		cta: "Start Pro",
		highlighted: true
	},
	{
		name: "Credit Pack",
		price: "$9",
		period: "/ 100 images",
		features: [
			"100 image credits",
			"Never expire",
			"Stack with Free plan",
			"Great for bursts"
		],
		cta: "Buy pack",
		highlighted: false
	}
];
function PricingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-gradient-hero py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl px-4 text-center sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-4xl font-extrabold tracking-tight md:text-5xl",
						children: [
							"Simple, ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient-brand",
								children: "transparent"
							}),
							" pricing"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-lg text-muted-foreground",
						children: "Start free. Upgrade only when you need more."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3",
					children: tiers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `glass relative rounded-2xl p-8 ${t.highlighted ? "border-primary/50 shadow-glow" : ""}`,
						children: [
							t.highlighted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-3 left-6 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-primary-foreground",
								children: "Most popular"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-semibold",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-4xl font-extrabold tracking-tight",
									children: t.price
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: t.period
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-6 space-y-3 text-sm",
								children: t.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-secondary" }),
										" ",
										f
									]
								}, f))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: `mt-8 w-full ${t.highlighted ? "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90" : ""}`,
								variant: t.highlighted ? "default" : "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: { mode: "signup" },
									children: t.cta
								})
							})
						]
					}, t.name))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-center text-xs text-muted-foreground",
					children: "Billing launches in our next release. Free tier is live today."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { PricingPage as component };
