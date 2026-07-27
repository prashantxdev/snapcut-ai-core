import { supabase } from "@/integrations/supabase/client";

export interface DashboardData {
  credits: {
    plan: string;
    daily_used: number;
    daily_limit: number;
    pack_credits: number;
    daily_reset_at: string;
  };
  uploads: {
    id: string;
    status: string;
    original_filename: string | null;
    created_at: string;
    expires_at: string;
    result_path: string | null;
  }[];
}

export const getDashboard = async (): Promise<DashboardData> => {
  const { data: userData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !userData?.user) {
    throw new Error("Unauthorized: Not signed in");
  }
  const userId = userData.user.id;

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
};