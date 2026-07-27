import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { createMockSupabaseClient } from './mock-client';

function createSupabaseClient(): SupabaseClient<Database> {
  // Use import.meta.env for client-side (Vite build-time replacement)
  // Fall back to process.env for SSR (server-side rendering)
  let SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || process.env.SUPABASE_URL;
  let SUPABASE_PUBLISHABLE_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || process.env.SUPABASE_PUBLISHABLE_KEY;

  // Normalize string "undefined" / "null" values that some bundlers/environments set
  if (SUPABASE_URL === 'undefined' || SUPABASE_URL === 'null') SUPABASE_URL = undefined;
  if (SUPABASE_PUBLISHABLE_KEY === 'undefined' || SUPABASE_PUBLISHABLE_KEY === 'null') SUPABASE_PUBLISHABLE_KEY = undefined;

  const isMock = !SUPABASE_URL || SUPABASE_URL.includes("xgconhzyasyyzvzpjahx");
  if (isMock) {
    return createMockSupabaseClient() as any;
  }

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  });
}

let _supabase: SupabaseClient<Database> | undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

