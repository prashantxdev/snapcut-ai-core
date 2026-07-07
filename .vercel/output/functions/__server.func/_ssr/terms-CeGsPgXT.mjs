import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-CnPwCPAI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-CeGsPgXT.js
var import_jsx_runtime = require_jsx_runtime();
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mx-auto max-w-3xl px-4 py-16 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "Terms of Service"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString()]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "prose prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-8 text-lg font-semibold text-foreground",
								children: "Acceptable use"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You must own — or have permission to process — every image you upload. Do not upload illegal content or content depicting minors in inappropriate contexts." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-lg font-semibold text-foreground",
								children: "Limits"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Max file size 10 MB; max resolution 5000×5000; supported formats JPG, PNG, WEBP. Free accounts may process up to 5 images per day." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-lg font-semibold text-foreground",
								children: "Availability"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We aim for 99.5% uptime but provide the service on an as-is basis without warranty of any kind." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-lg font-semibold text-foreground",
								children: "Termination"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We may suspend accounts that abuse the service or violate these terms." })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { TermsPage as component };
