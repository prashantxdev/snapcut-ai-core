import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ProcessInput = z.object({
  uploadPath: z.string().min(1).max(512),
  originalFilename: z.string().min(1).max(256),
  originalSize: z.number().int().positive().max(10 * 1024 * 1024),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

export const processUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ProcessInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { removeBackground } = await import("./bg-removal.server");

    // Reset daily window if needed
    const { data: credits, error: credErr } = await supabase
      .from("credits")
      .select("plan, daily_used, daily_limit, pack_credits, daily_reset_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (credErr) throw new Error(credErr.message);
    if (!credits) throw new Error("No credits record found.");

    let { daily_used, daily_limit, pack_credits, plan } = credits;
    const resetAt = new Date(credits.daily_reset_at);
    if (resetAt <= new Date()) {
      daily_used = 0;
      await supabaseAdmin
        .from("credits")
        .update({
          daily_used: 0,
          daily_reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("user_id", userId);
    }

    const isPro = plan === "pro";
    const canUseDaily = isPro || daily_used < daily_limit;
    const canUsePack = pack_credits > 0;
    if (!canUseDaily && !canUsePack) {
      throw new Error("Daily limit reached. Upgrade to Pro or buy a credit pack to continue.");
    }

    // Insert upload row (processing)
    const { data: upload, error: insErr } = await supabaseAdmin
      .from("uploads")
      .insert({
        user_id: userId,
        original_path: data.uploadPath,
        original_filename: data.originalFilename,
        original_size: data.originalSize,
        status: "processing",
      })
      .select("id")
      .single();
    if (insErr) throw new Error(insErr.message);

    try {
      // Download original from private bucket
      const { data: blob, error: dlErr } = await supabaseAdmin.storage
        .from("uploads")
        .download(data.uploadPath);
      if (dlErr || !blob) throw new Error(dlErr?.message || "Failed to download upload");
      const bytes = new Uint8Array(await blob.arrayBuffer());

      const result = await removeBackground({
        bytes,
        contentType: data.contentType,
        filename: data.originalFilename,
      });

      const resultPath = `${userId}/${upload.id}.png`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("results")
        .upload(resultPath, result.bytes as unknown as Blob, {
          contentType: result.contentType,
          upsert: true,
        });
      if (upErr) throw new Error(upErr.message);

      await supabaseAdmin
        .from("uploads")
        .update({ status: "done", result_path: resultPath })
        .eq("id", upload.id);

      // Decrement credit
      if (canUseDaily) {
        await supabaseAdmin
          .from("credits")
          .update({ daily_used: daily_used + 1 })
          .eq("user_id", userId);
      } else {
        await supabaseAdmin
          .from("credits")
          .update({ pack_credits: pack_credits - 1 })
          .eq("user_id", userId);
      }

      // Signed URL valid 1 hour
      const { data: signed, error: sErr } = await supabaseAdmin.storage
        .from("results")
        .createSignedUrl(resultPath, 3600);
      if (sErr || !signed) throw new Error(sErr?.message || "Failed to sign URL");

      return {
        uploadId: upload.id,
        resultUrl: signed.signedUrl,
        resultPath,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed";
      await supabaseAdmin
        .from("uploads")
        .update({ status: "failed", error: msg })
        .eq("id", upload.id);
      throw new Error(msg);
    }
  });

export const getResultSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ uploadId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("uploads")
      .select("result_path, user_id")
      .eq("id", data.uploadId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row || row.user_id !== userId || !row.result_path) {
      throw new Error("Not found");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from("results")
      .createSignedUrl(row.result_path, 3600);
    if (sErr || !signed) throw new Error(sErr?.message || "Failed to sign URL");
    return { url: signed.signedUrl };
  });