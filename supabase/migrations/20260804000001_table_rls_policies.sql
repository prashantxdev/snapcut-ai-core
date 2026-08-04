-- RLS policies for public.uploads and public.credits
DO $$
BEGIN
  -- uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'uploads' AND policyname = 'Users insert own uploads'
  ) THEN
    CREATE POLICY "Users insert own uploads" ON public.uploads FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'uploads' AND policyname = 'Users update own uploads'
  ) THEN
    CREATE POLICY "Users update own uploads" ON public.uploads FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'uploads' AND policyname = 'Users delete own uploads'
  ) THEN
    CREATE POLICY "Users delete own uploads" ON public.uploads FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- credits
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'credits' AND policyname = 'Users update own credits'
  ) THEN
    CREATE POLICY "Users update own credits" ON public.credits FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'credits' AND policyname = 'Users insert own credits'
  ) THEN
    CREATE POLICY "Users insert own credits" ON public.credits FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
