import { i as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as createServerFn } from "./esm-DTf75a_C.mjs";
import { n as createSsrRpc } from "./mock-client-DsyBJBK7.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn, t as Button } from "./button-sQyoalR3.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as ImageOff, n as WandSparkles, r as TriangleAlert, u as LoaderCircle, y as Check } from "../_libs/lucide-react.mjs";
import { n as useServerFn, t as AppShell } from "./AppShell-Czi7mmsj.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Oflpx3X0.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CZSqA1Em.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("367b32358181f96a433e5e7716daa74b5dbcf69e0677716fe7be918df41797ef"));
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
function DashboardPage() {
	const fetcher = useServerFn(getDashboard);
	const { data, isLoading, error } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fetcher()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Your credits and recent activity"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "mr-1 h-4 w-4" }), " Open workspace"]
					})
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }), " Loading…"]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-6 text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mb-2 h-5 w-5" }), error instanceof Error ? error.message : "Could not load dashboard"]
			}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: "Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-bold capitalize",
										children: data.credits.plan
									}), data.credits.plan === "pro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-gradient-brand px-2 py-0.5 text-xs font-semibold text-primary-foreground",
										children: "PRO"
									})]
								}),
								data.credits.plan === "free" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/pricing",
										children: "Upgrade"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-2xl font-bold",
									children: [
										data.credits.daily_used,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-normal text-muted-foreground",
											children: ["/ ", data.credits.plan === "pro" ? "∞" : data.credits.daily_limit]
										})
									]
								}),
								data.credits.plan !== "pro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: data.credits.daily_used / data.credits.daily_limit * 100,
									className: "mt-3 h-2"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: "Pack credits"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold",
									children: data.credits.pack_credits
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Never expire"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 mt-10 text-lg font-semibold",
					children: "Recent uploads"
				}),
				data.uploads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass flex flex-col items-center rounded-2xl p-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "mb-3 h-8 w-8 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "No uploads yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Process your first image to see it here."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-4 bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app",
								children: "Open workspace"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "glass divide-y divide-border/50 overflow-hidden rounded-2xl",
					children: data.uploads.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: u.original_filename ?? "image"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									formatDistanceToNow(new Date(u.created_at), { addSuffix: true }),
									" · expires ",
									formatDistanceToNow(new Date(u.expires_at), { addSuffix: true })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: u.status })]
					}, u.id))
				})
			] })
		]
	}) });
}
function StatusBadge({ status }) {
	if (status === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-medium text-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Done"]
	});
	if (status === "failed") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-destructive/20 px-2.5 py-1 text-xs font-medium text-destructive",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " Failed"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
			" ",
			status
		]
	});
}
//#endregion
export { DashboardPage as component };
