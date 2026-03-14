
CREATE TABLE public.works_in_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  url TEXT,
  author TEXT DEFAULT 'Dr. Dina Lundy',
  expected_date TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.works_in_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage works_in_progress" ON public.works_in_progress FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Works in progress readable by all" ON public.works_in_progress FOR SELECT USING (true);

CREATE TRIGGER update_works_in_progress_updated_at BEFORE UPDATE ON public.works_in_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
