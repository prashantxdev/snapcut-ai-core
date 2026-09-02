-- ============ PER-USER HISTORY TABLE & RLS ============

CREATE TABLE IF NOT EXISTS public.history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  original_path text,
  result_path text NOT NULL,
  original_size integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast user history lookups ordered by creation date
CREATE INDEX IF NOT EXISTS history_user_created_idx ON public.history(user_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.history TO authenticated;
GRANT ALL ON public.history TO service_role;

-- Strict Per-User RLS Policies (using auth.uid())
DO $$
BEGIN
  -- SELECT: A user can read only their own history
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'history' AND policyname = 'Users view own history'
  ) THEN
    CREATE POLICY "Users view own history" ON public.history FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- INSERT: A user can create history records only for themselves
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'history' AND policyname = 'Users insert own history'
  ) THEN
    CREATE POLICY "Users insert own history" ON public.history FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- UPDATE: A user can update only their own history
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'history' AND policyname = 'Users update own history'
  ) THEN
    CREATE POLICY "Users update own history" ON public.history FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- DELETE: A user can delete only their own history
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'history' AND policyname = 'Users delete own history'
  ) THEN
    CREATE POLICY "Users delete own history" ON public.history FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Preserve and backfill existing completed uploads into the history table
INSERT INTO public.history (id, user_id, filename, original_path, result_path, original_size, created_at)
SELECT 
  id, 
  user_id, 
  COALESCE(original_filename, 'image.png') AS filename, 
  original_path, 
  result_path, 
  original_size, 
  created_at
FROM public.uploads
WHERE status = 'done' AND result_path IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Update cleanup_expired_uploads function so it does NOT delete user history files from storage
CREATE OR REPLACE FUNCTION public.cleanup_expired_uploads()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  rec record;
BEGIN
  -- Only clean up failed or abandoned pending uploads older than 24 hours that are not in history
  FOR rec IN 
    SELECT id, original_path, result_path 
    FROM public.uploads 
    WHERE expires_at < now() 
      AND status IN ('failed', 'pending')
      AND id NOT IN (SELECT id FROM public.history)
  LOOP
    IF rec.original_path IS NOT NULL THEN
      DELETE FROM storage.objects WHERE bucket_id = 'uploads' AND name = rec.original_path;
    END IF;
    IF rec.result_path IS NOT NULL THEN
      DELETE FROM storage.objects WHERE bucket_id = 'results' AND name = rec.result_path;
    END IF;
    DELETE FROM public.uploads WHERE id = rec.id;
  END LOOP;
END;
$$;
