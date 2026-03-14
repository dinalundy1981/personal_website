ALTER TABLE public.publishing ADD COLUMN IF NOT EXISTS author text DEFAULT 'Dr. Dina Lundy';
ALTER TABLE public.publishing ADD COLUMN IF NOT EXISTS abstract text;