-- Create storage buckets for uploads and background removal results
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('uploads', 'uploads', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('results', 'results', false, 10485760, ARRAY['image/png'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Add RLS policies for results bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users upload to own folder (results)'
  ) THEN
    CREATE POLICY "Users upload to own folder (results)" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'results' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users update own folder (results)'
  ) THEN
    CREATE POLICY "Users update own folder (results)" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'results' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users delete own results'
  ) THEN
    CREATE POLICY "Users delete own results" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'results' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
