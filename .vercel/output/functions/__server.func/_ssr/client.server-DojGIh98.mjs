import { t as createMockSupabaseClient } from "./mock-client-DjPvGP23.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.server-DojGIh98.js
function createSupabaseAdminClient() {
	let SUPABASE_URL = process.env.SUPABASE_URL;
	let SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (SUPABASE_URL === "undefined" || SUPABASE_URL === "null") SUPABASE_URL = void 0;
	if (SUPABASE_SERVICE_ROLE_KEY === "undefined" || SUPABASE_SERVICE_ROLE_KEY === "null") SUPABASE_SERVICE_ROLE_KEY = void 0;
	if (!SUPABASE_URL || SUPABASE_URL.includes("xgconhzyasyyzvzpjahx")) return createMockSupabaseClient();
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} });
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
	return Reflect.get(_supabaseAdmin, prop, receiver);
} });
//#endregion
export { supabaseAdmin };
