import { supabase } from "@/integrations/supabase/client";
import { removeBackground } from "./bg-removal";

export const processUpload = async (args: {
  data: {
    uploadPath: string;
    originalFilename: string;
    originalSize: number;
    contentType: "image/jpeg" | "image/png" | "image/webp";
  };
}) => {
  const { uploadPath, originalFilename, originalSize, contentType } = args.data;

  const { data: userData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !userData?.user) {
    throw new Error("Unauthorized: Not signed in");
  }
  const userId = userData.user.id;

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
    await supabase
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
  const { data: upload, error: insErr } = await supabase
    .from("uploads")
    .insert({
      user_id: userId,
      original_path: uploadPath,
      original_filename: originalFilename,
      original_size: originalSize,
      status: "processing",
    })
    .select("id")
    .single();
  if (insErr) throw new Error(insErr.message);

  try {
    // Download original from private bucket
    const { data: blob, error: dlErr } = await supabase.storage
      .from("uploads")
      .download(uploadPath);
    if (dlErr || !blob) throw new Error(dlErr?.message || "Failed to download upload");
    const bytes = new Uint8Array(await blob.arrayBuffer());

    const result = await removeBackground({
      bytes,
      contentType,
      filename: originalFilename,
    });

    const resultPath = `${userId}/${upload.id}.png`;
    const { error: upErr } = await supabase.storage
      .from("results")
      .upload(resultPath, result.bytes as unknown as Blob, {
        contentType: result.contentType,
        upsert: true,
      });
    if (upErr) throw new Error(upErr.message);

    await supabase
      .from("uploads")
      .update({ status: "done", result_path: resultPath })
      .eq("id", upload.id);

    // Decrement credit
    if (canUseDaily) {
      await supabase
        .from("credits")
        .update({ daily_used: daily_used + 1 })
        .eq("user_id", userId);
    } else {
      await supabase
        .from("credits")
        .update({ pack_credits: pack_credits - 1 })
        .eq("user_id", userId);
    }

    // Signed URL valid 1 hour
    const { data: signed, error: sErr } = await supabase.storage
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
    await supabase
      .from("uploads")
      .update({ status: "failed", error: msg })
      .eq("id", upload.id);
    throw new Error(msg);
  }
};

export const getResultSignedUrl = async (args: { data: { uploadId: string } }) => {
  const { data: userData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !userData?.user) {
    throw new Error("Unauthorized: Not signed in");
  }
  const userId = userData.user.id;

  const { data: row, error } = await supabase
    .from("uploads")
    .select("result_path, user_id")
    .eq("id", args.data.uploadId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || row.user_id !== userId || !row.result_path) {
    throw new Error("Not found");
  }
  const { data: signed, error: sErr } = await supabase.storage
    .from("results")
    .createSignedUrl(row.result_path, 3600);
  if (sErr || !signed) throw new Error(sErr?.message || "Failed to sign URL");
  return { url: signed.signedUrl };
};