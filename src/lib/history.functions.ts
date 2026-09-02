import { supabase } from "@/integrations/supabase/client";

export interface HistoryItem {
  id: string;
  filename: string;
  originalUrl: string;
  resultUrl: string;
  timestamp: number;
}

/**
 * Fetch all history items for the currently authenticated user from Supabase database
 * and generate secure signed URLs for result and original images.
 */
export async function fetchUserHistory(userId?: string | null): Promise<HistoryItem[]> {
  if (!userId) return [];

  // Verify auth session matches the requested userId
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user || userData.user.id !== userId) {
    return [];
  }

  // 1. Fetch user history records from Supabase database table with RLS enforcement
  const { data: records, error } = await supabase
    .from("history")
    .select("id, user_id, filename, original_path, result_path, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[History] Error fetching history from Supabase:", error);
    throw new Error(error.message);
  }

  if (!records || records.length === 0) {
    return [];
  }

  // 2. Generate signed URLs in batch for results and originals (valid for 1 hour)
  const resultPaths = records.map((r) => r.result_path).filter(Boolean) as string[];
  const originalPaths = records.map((r) => r.original_path).filter(Boolean) as string[];

  const [resultSignedUrls, origSignedUrls] = await Promise.all([
    resultPaths.length > 0
      ? supabase.storage.from("results").createSignedUrls(resultPaths, 3600)
      : Promise.resolve({ data: [] as { path: string | null; signedUrl: string }[] }),
    originalPaths.length > 0
      ? supabase.storage.from("uploads").createSignedUrls(originalPaths, 3600)
      : Promise.resolve({ data: [] as { path: string | null; signedUrl: string }[] }),
  ]);

  const resultMap = new Map<string, string>();
  if (resultSignedUrls.data) {
    for (const item of resultSignedUrls.data) {
      if (item.signedUrl && item.path) {
        resultMap.set(item.path, item.signedUrl);
      }
    }
  }

  const origMap = new Map<string, string>();
  if (origSignedUrls.data) {
    for (const item of origSignedUrls.data) {
      if (item.signedUrl && item.path) {
        origMap.set(item.path, item.signedUrl);
      }
    }
  }

  const items: HistoryItem[] = [];
  for (const record of records) {
    const resultUrl = resultMap.get(record.result_path) || "";
    const originalUrl = (record.original_path ? origMap.get(record.original_path) : "") || resultUrl;

    if (resultUrl) {
      items.push({
        id: record.id,
        filename: record.filename,
        originalUrl,
        resultUrl,
        timestamp: new Date(record.created_at).getTime(),
      });
    }
  }

  return items;
}

/**
 * Delete a specific history item by ID for the authenticated user
 */
export async function deleteUserHistoryItem(id: string, userId: string): Promise<void> {
  // 1. Get record paths to clean up associated storage objects
  const { data: record } = await supabase
    .from("history")
    .select("original_path, result_path")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  // 2. Delete row from Supabase history table (RLS enforces user_id = auth.uid())
  const { error } = await supabase
    .from("history")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  // 3. Delete from storage buckets if paths exist
  if (record?.result_path) {
    await supabase.storage.from("results").remove([record.result_path]);
  }
  if (record?.original_path) {
    await supabase.storage.from("uploads").remove([record.original_path]);
  }
}

/**
 * Clear all history items for the authenticated user
 */
export async function clearUserHistory(userId: string): Promise<void> {
  // 1. Fetch paths before deletion to clean up storage
  const { data: records } = await supabase
    .from("history")
    .select("original_path, result_path")
    .eq("user_id", userId);

  // 2. Delete all history rows for this user
  const { error } = await supabase
    .from("history")
    .delete()
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  // 3. Clean up storage files
  if (records && records.length > 0) {
    const resultPaths = records.map((r) => r.result_path).filter(Boolean) as string[];
    const originalPaths = records.map((r) => r.original_path).filter(Boolean) as string[];

    if (resultPaths.length > 0) {
      await supabase.storage.from("results").remove(resultPaths);
    }
    if (originalPaths.length > 0) {
      await supabase.storage.from("uploads").remove(originalPaths);
    }
  }
}
