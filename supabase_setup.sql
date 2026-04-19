-- 1. Create the "notes" table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create the "notes-files" storage bucket and make it public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('notes-files', 'notes-files', true);

-- 3. Set up Storage Policies (Required for public access to files within the bucket)
-- Allow anyone to read files from the bucket
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'notes-files');

-- Allow anyone to upload new files to the bucket
CREATE POLICY "Public Insert Access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'notes-files');
