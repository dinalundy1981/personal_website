ALTER TABLE public.podcasts 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS podcast_format text DEFAULT 'audio',
ADD COLUMN IF NOT EXISTS video_url text;