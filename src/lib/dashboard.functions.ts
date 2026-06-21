import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [creditsRes, uploadsRes] = await Promise.all([
      supabase
        .from("credits")
        .select("plan, daily_used, daily_limit, pack_credits, daily_reset_at")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("uploads")
        .select("id, status, original_filename, created_at, expires_at, result_path")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (creditsRes.error) throw new Error(creditsRes.error.message);
    if (uploadsRes.error) throw new Error(uploadsRes.error.message);

    return {
      credits: creditsRes.data ?? {
        plan: "free",
        daily_used: 0,
        daily_limit: 5,
        pack_credits: 0,
        daily_reset_at: new Date(Date.now() + 86400000).toISOString(),
      },
      uploads: uploadsRes.data ?? [],
    };
  });