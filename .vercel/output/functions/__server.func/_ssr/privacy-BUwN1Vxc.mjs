import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-LUylfG5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-BUwN1Vxc.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mx-auto max-w-3xl px-4 py-16 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "Privacy Policy"
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
								children: "Images you upload"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Images are stored in encrypted private storage and automatically deleted 24 hours after upload. We do not use your images to train models. Only you can access your uploads and results through signed URLs scoped to your account." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-lg font-semibold text-foreground",
								children: "Account data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We collect your email and authentication identifiers required to operate the service. We do not sell your data." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-lg font-semibold text-foreground",
								children: "Third parties"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Background removal is performed by a third-party AI provider. Images are transmitted over TLS and not retained by the provider beyond the duration of the request." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-lg font-semibold text-foreground",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Questions? Reach out via the contact channel on your account." })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { PrivacyPage as component };
