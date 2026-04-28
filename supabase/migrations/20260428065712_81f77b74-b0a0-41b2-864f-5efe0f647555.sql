CREATE TABLE public.homepage_about_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  eyebrow TEXT NOT NULL DEFAULT 'About Dr. Dina Lundy',
  heading_line1 TEXT NOT NULL DEFAULT 'The Voice of',
  heading_highlight TEXT NOT NULL DEFAULT 'Authority & Insight',
  paragraph1 TEXT NOT NULL DEFAULT 'Born and raised in New York City, Dr. Dina Lundy built a coffee bar chain from the ground up, becoming a millionaire at 28. That success led her to pursue something deeper—her purpose. She earned a doctorate, transitioned into academe, writing, and life coaching, helping others break through their fear and build lives they believe in.',
  paragraph2 TEXT NOT NULL DEFAULT 'As a writer, researcher, and public speaker, her work intersects systemic inequity, implicit bias, and the phenomenology of youth whose lives have been shaped by foster care and criminal justice involvement. Her philosophy:',
  quote TEXT NOT NULL DEFAULT 'Empower through education.',
  stat1_number TEXT NOT NULL DEFAULT '5+',
  stat1_label TEXT NOT NULL DEFAULT 'Published Books',
  stat2_number TEXT NOT NULL DEFAULT '100+',
  stat2_label TEXT NOT NULL DEFAULT 'Speaking Events',
  stat3_number TEXT NOT NULL DEFAULT '20+',
  stat3_label TEXT NOT NULL DEFAULT 'Years Experience',
  button_text TEXT NOT NULL DEFAULT 'Learn More About Dr. Lundy',
  badge_number TEXT NOT NULL DEFAULT '30+',
  badge_label TEXT NOT NULL DEFAULT 'Years of Expertise',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_about_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "About settings readable by all" ON public.homepage_about_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage about settings" ON public.homepage_about_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_homepage_about_settings_updated_at
BEFORE UPDATE ON public.homepage_about_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.homepage_about_settings DEFAULT VALUES;