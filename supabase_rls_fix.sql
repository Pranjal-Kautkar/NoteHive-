-- Fix for: "new row violates row-level security policy for table 'notes'"

-- Explicitly enable RLS (it might have been turned on inside your dashboard)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 1. Allow anyone to read all uploaded notes
CREATE POLICY "Public Read Access for Notes"
ON public.notes FOR SELECT
TO public
USING (true);

-- 2. Allow anyone to upload a new note
CREATE POLICY "Public Insert Access for Notes"
ON public.notes FOR INSERT
TO public
WITH CHECK (true);
