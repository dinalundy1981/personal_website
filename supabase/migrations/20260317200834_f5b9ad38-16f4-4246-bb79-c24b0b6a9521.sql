CREATE TABLE public.tedx_talks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT DEFAULT 'Dr. Dina Lundy',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tedx_talks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "TEDx talks readable by all" ON public.tedx_talks FOR SELECT USING (true);
CREATE POLICY "Admins manage tedx talks" ON public.tedx_talks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_tedx_talks_updated_at BEFORE UPDATE ON public.tedx_talks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();