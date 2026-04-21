CREATE TABLE public.homepage_hero_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_text TEXT NOT NULL DEFAULT 'Family Advocate · Author · Keynote Speaker',
  heading_main TEXT NOT NULL DEFAULT 'Understanding the Human Mind While Strengthening',
  heading_highlight TEXT NOT NULL DEFAULT 'Court Cases.',
  subtitle TEXT NOT NULL DEFAULT 'Specializing in Psychological Analysis for Litigation, Criminal Cases and Forensic Evaluation',
  description TEXT NOT NULL DEFAULT 'Dr. Dina Lundy is a nationally recognized scholar, author, and speaker who has dedicated her career to education equity, foster youth advocacy, and leadership development with confidence and authority.',
  books_count_number TEXT NOT NULL DEFAULT '5+',
  books_count_label TEXT NOT NULL DEFAULT 'Published Books',
  forthcoming_label TEXT NOT NULL DEFAULT 'Forthcoming Release',
  forthcoming_title TEXT NOT NULL DEFAULT 'Self-Help Book for the Child Raised in Foster Care',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_hero_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero settings readable by all"
  ON public.homepage_hero_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage hero settings"
  ON public.homepage_hero_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_homepage_hero_settings_updated_at
  BEFORE UPDATE ON public.homepage_hero_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.homepage_hero_settings DEFAULT VALUES;