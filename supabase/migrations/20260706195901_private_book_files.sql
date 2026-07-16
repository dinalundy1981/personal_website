-- Book files must only be reachable by admins or buyers with an approved order,
-- not by anyone with the URL. Make the bucket private and gate reads via RLS.
UPDATE storage.buckets SET public = false WHERE id = 'book-files';

-- Existing rows stored the full public URL; normalize to the bare object path
-- so it can be compared against storage.objects.name below.
UPDATE public.books
SET file_url = regexp_replace(file_url, '^.*/book-files/', '')
WHERE file_url LIKE '%/book-files/%';

DROP POLICY IF EXISTS "Anyone can read book files" ON storage.objects;

CREATE POLICY "Book file access for buyers and admins" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'book-files' AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.book_orders bo
        JOIN public.books b ON b.id = bo.book_id
        WHERE bo.user_id = auth.uid()
          AND bo.status = 'approved'
          AND b.file_url = storage.objects.name
      )
    )
  );
