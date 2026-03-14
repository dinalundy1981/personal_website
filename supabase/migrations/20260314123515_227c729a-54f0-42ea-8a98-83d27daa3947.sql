
-- Media categories table
CREATE TABLE public.media_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media categories readable by all" ON public.media_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage media categories" ON public.media_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Media items (images within categories)
CREATE TABLE public.media_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.media_categories(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  subtitle TEXT,
  year TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media items readable by all" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "Admins manage media items" ON public.media_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Featured talks table
CREATE TABLE public.featured_talks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  author_name TEXT,
  date TEXT,
  keywords TEXT,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.featured_talks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Featured talks readable by all" ON public.featured_talks FOR SELECT USING (true);
CREATE POLICY "Admins manage featured talks" ON public.featured_talks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
