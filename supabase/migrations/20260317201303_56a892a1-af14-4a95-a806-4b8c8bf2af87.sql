-- Add book_format and file_url columns to books table
ALTER TABLE public.books ADD COLUMN book_format TEXT DEFAULT 'physical';
ALTER TABLE public.books ADD COLUMN file_url TEXT;

-- Create storage bucket for book files (PDFs and audio)
INSERT INTO storage.buckets (id, name, public) VALUES ('book-files', 'book-files', true);

-- Allow anyone to read book files
CREATE POLICY "Anyone can read book files" ON storage.objects FOR SELECT USING (bucket_id = 'book-files');

-- Allow admins to upload book files
CREATE POLICY "Admins can upload book files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete book files
CREATE POLICY "Admins can delete book files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update book files
CREATE POLICY "Admins can update book files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'::app_role));