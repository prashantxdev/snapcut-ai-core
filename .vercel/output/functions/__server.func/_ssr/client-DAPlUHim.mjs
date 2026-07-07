import { t as createMockSupabaseClient } from "./mock-client-DjPvGP23.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-DAPlUHim.js
function createSupabaseClient() {
	let SUPABASE_URL = typeof import.meta !== "undefined" && "https://xgconhzyasyyzvzpjahx.supabase.co" || process.env.SUPABASE_URL;
	let SUPABASE_PUBLISHABLE_KEY = typeof import.meta !== "undefined" && "sb_publishable_gRVqoIau06gbJfTNuPwchg_LvdIP7vB" || process.env.SUPABASE_PUBLISHABLE_KEY;
	if (SUPABASE_URL === "undefined" || SUPABASE_URL === "null") SUPABASE_URL = void 0;
	if (SUPABASE_PUBLISHABLE_KEY === "undefined" || SUPABASE_PUBLISHABLE_KEY === "null") SUPABASE_PUBLISHABLE_KEY = void 0;
	if (!SUPABASE_URL || SUPABASE_URL.includes("xgconhzyasyyzvzpjahx")) return createMockSupabaseClient();
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
