import { u as createServerFn } from "./esm-DTf75a_C.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Oflpx3X0.mjs";
import { t as createServerRpc } from "./createServerRpc-CMkeCIdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/processing.functions-bluR7sGz.js
var ProcessInput = objectType({
	uploadPath: stringType().min(1).max(512),
	originalFilename: stringType().min(1).max(256),
	originalSize: numberType().int().positive().max(10 * 1024 * 1024),
	contentType: enumType([
		"image/jpeg",
		"image/png",
		"image/webp"
	])
});
var processUpload_createServerFn_handler = createServerRpc({
	id: "53c2e2345ccae48836475fc6df9583838d94686b3014a94c8c8d329392eb39a2",
	name: "processUpload",
	filename: "src/lib/processing.functions.ts"
}, (opts) => processUpload.__executeServer(opts));
var processUpload = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ProcessInput.parse(input)).handler(processUpload_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { supabaseAdmin } = await import("./client.server-uvDsPIzu.mjs");
	const { removeBackground } = await import("./bg-removal.server-DpMf-c-q.mjs");
	const { data: credits, error: credErr } = await supabase.from("credits").select("plan, daily_used, daily_limit, pack_credits, daily_reset_at").eq("user_id", userId).maybeSingle();
	if (credErr) throw new Error(credErr.message);
	if (!credits) throw new Error("No credits record found.");
	let { daily_used, daily_limit, pack_credits, plan } = credits;
	if (new Date(credits.daily_reset_at) <= /* @__PURE__ */ new Date()) {
		daily_used = 0;
		await supabaseAdmin.from("credits").update({
			daily_used: 0,
			daily_reset_at: new Date(Date.now() + 1440 * 60 * 1e3).toISOString()
		}).eq("user_id", userId);
	}
	const canUseDaily = plan === "pro" || daily_used < daily_limit;
	if (!canUseDaily && !(pack_credits > 0)) throw new Error("Daily limit reached. Upgrade to Pro or buy a credit pack to continue.");
	const { data: upload, error: insErr } = await supabaseAdmin.from("uploads").insert({
		user_id: userId,
		original_path: data.uploadPath,
		original_filename: data.originalFilename,
		original_size: data.originalSize,
		status: "processing"
	}).select("id").single();
	if (insErr) throw new Error(insErr.message);
	try {
		const { data: blob, error: dlErr } = await supabaseAdmin.storage.from("uploads").download(data.uploadPath);
		if (dlErr || !blob) throw new Error(dlErr?.message || "Failed to download upload");
		const result = await removeBackground({
			bytes: new Uint8Array(await blob.arrayBuffer()),
			contentType: data.contentType,
			filename: data.originalFilename
		});
		const resultPath = `${userId}/${upload.id}.png`;
		const { error: upErr } = await supabaseAdmin.storage.from("results").upload(resultPath, result.bytes, {
			contentType: result.contentType,
			upsert: true
		});
		if (upErr) throw new Error(upErr.message);
		await supabaseAdmin.from("uploads").update({
			status: "done",
			result_path: resultPath
		}).eq("id", upload.id);
		if (canUseDaily) await supabaseAdmin.from("credits").update({ daily_used: daily_used + 1 }).eq("user_id", userId);
		else await supabaseAdmin.from("credits").update({ pack_credits: pack_credits - 1 }).eq("user_id", userId);
		const { data: signed, error: sErr } = await supabaseAdmin.storage.from("results").createSignedUrl(resultPath, 3600);
		if (sErr || !signed) throw new Error(sErr?.message || "Failed to sign URL");
		return {
			uploadId: upload.id,
			resultUrl: signed.signedUrl,
			resultPath
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Processing failed";
		await supabaseAdmin.from("uploads").update({
			status: "failed",
			error: msg
		}).eq("id", upload.id);
		throw new Error(msg);
	}
});
var getResultSignedUrl_createServerFn_handler = createServerRpc({
	id: "9753e6b707369a2d7ea7a4d916419f59db89acbe52dd78f4d537c62f8ee3ad2f",
	name: "getResultSignedUrl",
	filename: "src/lib/processing.functions.ts"
}, (opts) => getResultSignedUrl.__executeServer(opts));
var getResultSignedUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ uploadId: stringType().uuid() }).parse(input)).handler(getResultSignedUrl_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: row, error } = await supabase.from("uploads").select("result_path, user_id").eq("id", data.uploadId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!row || row.user_id !== userId || !row.result_path) throw new Error("Not found");
	const { supabaseAdmin } = await import("./client.server-uvDsPIzu.mjs");
	const { data: signed, error: sErr } = await supabaseAdmin.storage.from("results").createSignedUrl(row.result_path, 3600);
	if (sErr || !signed) throw new Error(sErr?.message || "Failed to sign URL");
	return { url: signed.signedUrl };
});
//#endregion
export { getResultSignedUrl_createServerFn_handler, processUpload_createServerFn_handler };
