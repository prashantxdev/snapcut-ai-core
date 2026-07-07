import { i as __toESM } from "../_runtime.mjs";
import { _ as useSearch, g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-C9IS7_c_.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Logo, t as Button } from "./button-sQyoalR3.mjs";
import { u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-yDozaxrO.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BEv2oEYY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168."))) {
		const redirectTo = opts?.redirect_uri || window.location.origin + "/app";
		const { error } = await supabase.auth.signInWithOAuth({
			provider: provider === "lovable" ? "google" : provider,
			options: {
				redirectTo,
				queryParams: opts?.extraParams
			}
		});
		if (error) return {
			error,
			redirected: false
		};
		return {
			error: null,
			redirected: true
		};
	}
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)(useSearch({ from: "/auth" }).mode ?? "signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/app" });
		});
	}, [navigate]);
	async function handleEmail(e) {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: window.location.origin + "/app" }
				});
				if (error) throw error;
				if (data.session) {
					toast.success("Account created! Logging you in...");
					navigate({ to: "/app" });
				} else {
					toast.success("Account created! Please check your email to confirm your account before signing in.", { duration: 1e4 });
					setMode("signin");
				}
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				navigate({ to: "/app" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setLoading(false);
		}
	}
	async function handleGoogle() {
		setLoading(true);
		try {
			const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
			if (result.error) throw result.error;
			if (!result.redirected) navigate({ to: "/app" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Google sign-in failed");
			setLoading(false);
		}
	}
	async function handleReset() {
		if (!email) {
			toast.error("Enter your email above, then click reset.");
			return;
		}
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
		if (error) toast.error(error.message);
		else toast.success("Password reset email sent.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen bg-gradient-hero",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-full items-center justify-center px-4 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass w-full max-w-md rounded-2xl p-8 shadow-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-center text-2xl font-bold",
						children: mode === "signin" ? "Welcome back" : "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-center text-sm text-muted-foreground",
						children: mode === "signin" ? "Sign in to continue" : "Start with 5 free images per day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "mt-6 w-full",
						onClick: handleGoogle,
						disabled: loading,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}), "Continue with Google"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							"OR",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEmail,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								autoComplete: "email"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								autoComplete: mode === "signup" ? "new-password" : "current-password"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90",
								disabled: loading,
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), mode === "signin" ? "Sign in" : "Create account"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
							className: "hover:text-foreground",
							children: mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"
						}), mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleReset,
							className: "hover:text-foreground",
							children: "Forgot password?"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-foreground",
							children: "← Back to home"
						})
					})
				]
			})
		})
	});
}
function GoogleIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: "mr-2 h-4 w-4",
		viewBox: "0 0 24 24",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#EA4335",
			d: "M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.7 6.7 2.7 12s4.1 9.5 9.3 9.5c5.4 0 8.9-3.8 8.9-9.1 0-.6-.1-1.1-.2-1.6H12z"
		})
	});
}
//#endregion
export { AuthPage as component };
