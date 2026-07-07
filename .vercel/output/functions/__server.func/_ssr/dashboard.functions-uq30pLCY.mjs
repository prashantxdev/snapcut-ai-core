import { u as createServerFn } from "./esm-DTf75a_C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BtNOM4T_.mjs";
import { t as createServerRpc } from "./createServerRpc-CMkeCIdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.functions-uq30pLCY.js
var getDashboard_createServerFn_handler = createServerRpc({
	id: "367b32358181f96a433e5e7716daa74b5dbcf69e0677716fe7be918df41797ef",
	name: "getDashboard",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const [creditsRes, uploadsRes] = await Promise.all([supabase.from("credits").select("plan, daily_used, daily_limit, pack_credits, daily_reset_at").eq("user_id", userId).maybeSingle(), supabase.from("uploads").select("id, status, original_filename, created_at, expires_at, result_path").eq("user_id", userId).order("created_at", { ascending: false }).limit(50)]);
	if (creditsRes.error) throw new Error(creditsRes.error.message);
	if (uploadsRes.error) throw new Error(uploadsRes.error.message);
	return {
		credits: creditsRes.data ?? {
			plan: "free",
			daily_used: 0,
			daily_limit: 5,
			pack_credits: 0,
			daily_reset_at: new Date(Date.now() + 864e5).toISOString()
		},
		uploads: uploadsRes.data ?? []
	};
});
//#endregion
export { getDashboard_createServerFn_handler };
