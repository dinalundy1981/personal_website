-- ==========================================================
-- SUPABASE SCHEMA COMPLETE - UNIFIED DATABASE SCRIPT
-- ==========================================================
-- This script contains all tables, columns, constraints, RLS policies, 
-- triggers, functions, and storage bucket settings from all migrations.
-- Paste this script into the Supabase SQL Editor to initialize your database.
-- ==========================================================

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

-- 2. TRIGGER FUNCTIONS & GENERAL FUNCTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 3. USER ROLES & PROFILES TABLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to auto-create profile and user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CONTENT TABLES

-- Books
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT true,
  book_format TEXT DEFAULT 'physical',
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Book Orders
CREATE TABLE IF NOT EXISTS public.book_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  phone TEXT,
  country TEXT,
  payment_method TEXT,
  payment_email TEXT,
  admin_notes TEXT,
  customer_name TEXT,
  delivery_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Course Orders
CREATE TABLE IF NOT EXISTS public.course_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  phone TEXT,
  country TEXT,
  payment_method TEXT,
  payment_email TEXT,
  admin_notes TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT,
  delivery_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  image_url TEXT,
  max_attendees INTEGER,
  is_published BOOLEAN DEFAULT true,
  close_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event Images
CREATE TABLE IF NOT EXISTS public.event_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_id)
);

-- Media
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL DEFAULT 'video',
  url TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Media Categories
CREATE TABLE IF NOT EXISTS public.media_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Media Items
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.media_categories(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  subtitle TEXT,
  year TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Featured Talks
CREATE TABLE IF NOT EXISTS public.featured_talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  author_name TEXT,
  date TEXT,
  keywords TEXT,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blogs / Newsletters
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'Dr. Dina Lundy',
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Newsletters (Legacy table, in case it is queried by custom admin files)
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  image1_url TEXT,
  image2_url TEXT,
  image3_url TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Podcasts
CREATE TABLE IF NOT EXISTS public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  episode_number INTEGER,
  duration TEXT,
  image_url TEXT,
  category TEXT,
  podcast_format TEXT DEFAULT 'audio',
  video_url TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Publishing / Publications
CREATE TABLE IF NOT EXISTS public.publishing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  publication_type TEXT,
  url TEXT,
  image_url TEXT,
  published_date DATE,
  is_published BOOLEAN DEFAULT true,
  author TEXT DEFAULT 'Dr. Dina Lundy',
  abstract TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Works in Progress
CREATE TABLE IF NOT EXISTS public.works_in_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  url TEXT,
  author TEXT DEFAULT 'Dr. Dina Lundy',
  expected_date TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site Images
CREATE TABLE IF NOT EXISTS public.site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  image_url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (section)
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_type TEXT NOT NULL DEFAULT 'paypal',
  label TEXT NOT NULL,
  details TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Email Subscriptions
CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Homepage Hero Settings
CREATE TABLE IF NOT EXISTS public.homepage_hero_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text TEXT NOT NULL DEFAULT 'Family Advocate · Author · Keynote Speaker',
  heading_main TEXT NOT NULL DEFAULT 'Understanding the Human Mind While Strengthening',
  heading_highlight TEXT NOT NULL DEFAULT 'Court Cases.',
  subtitle TEXT NOT NULL DEFAULT 'Specializing in Psychological Analysis for Litigation, Criminal Cases and Forensic Evaluation',
  description TEXT NOT NULL DEFAULT 'Dr. Dina Lundy is a nationally recognized scholar, author, and speaker who has dedicated her career to education equity, foster youth advocacy, and leadership development with confidence and authority.',
  books_count_number TEXT NOT NULL DEFAULT '5+',
  books_count_label TEXT NOT NULL DEFAULT 'Published Books',
  forthcoming_label TEXT NOT NULL DEFAULT 'Forthcoming Release',
  forthcoming_title TEXT NOT NULL DEFAULT 'Self-Help Book for the Child Raised in Foster Care',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Homepage About Settings
CREATE TABLE IF NOT EXISTS public.homepage_about_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TEDx Talks (Section under settings / coaching page)
CREATE TABLE IF NOT EXISTS public.tedx_talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT DEFAULT 'Dr. Dina Lundy',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Philanthropy Cards
CREATE TABLE IF NOT EXISTS public.philanthropy_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. INITIAL VALUES INSERTIONS
INSERT INTO public.homepage_hero_settings (badge_text) 
SELECT 'Family Advocate · Author · Keynote Speaker' 
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_hero_settings);

INSERT INTO public.homepage_about_settings (eyebrow) 
SELECT 'About Dr. Dina Lundy' 
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_about_settings);

-- 6. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works_in_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tedx_talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.philanthropy_cards ENABLE ROW LEVEL SECURITY;

-- 7. SECURITY RLS POLICIES

-- User Roles
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles
DROP POLICY IF EXISTS "Public profiles readable" ON public.profiles;
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Books
DROP POLICY IF EXISTS "Books readable by all" ON public.books;
CREATE POLICY "Books readable by all" ON public.books FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage books" ON public.books;
CREATE POLICY "Admins manage books" ON public.books FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Book Orders
DROP POLICY IF EXISTS "Users view own book orders" ON public.book_orders;
CREATE POLICY "Users view own book orders" ON public.book_orders FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users create own book orders" ON public.book_orders;
CREATE POLICY "Users create own book orders" ON public.book_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage book orders" ON public.book_orders;
CREATE POLICY "Admins manage book orders" ON public.book_orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Courses
DROP POLICY IF EXISTS "Courses readable by all" ON public.courses;
CREATE POLICY "Courses readable by all" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Course Orders
DROP POLICY IF EXISTS "Users view own course orders" ON public.course_orders;
CREATE POLICY "Users view own course orders" ON public.course_orders FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users create own course orders" ON public.course_orders;
CREATE POLICY "Users create own course orders" ON public.course_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage course orders" ON public.course_orders;
CREATE POLICY "Admins manage course orders" ON public.course_orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Events
DROP POLICY IF EXISTS "Events readable by all" ON public.events;
CREATE POLICY "Events readable by all" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage events" ON public.events;
CREATE POLICY "Admins manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Event Images
DROP POLICY IF EXISTS "Event images readable by all" ON public.event_images;
CREATE POLICY "Event images readable by all" ON public.event_images FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins manage event images" ON public.event_images;
CREATE POLICY "Admins manage event images" ON public.event_images FOR ALL TO public USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Event Registrations
DROP POLICY IF EXISTS "Users view own registrations" ON public.event_registrations;
CREATE POLICY "Users view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can register interest" ON public.event_registrations;
CREATE POLICY "Anyone can register interest" ON public.event_registrations FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage registrations" ON public.event_registrations;
CREATE POLICY "Admins manage registrations" ON public.event_registrations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Media
DROP POLICY IF EXISTS "Media readable by all" ON public.media;
CREATE POLICY "Media readable by all" ON public.media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage media" ON public.media;
CREATE POLICY "Admins manage media" ON public.media FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Media Categories
DROP POLICY IF EXISTS "Media categories readable by all" ON public.media_categories;
CREATE POLICY "Media categories readable by all" ON public.media_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage media categories" ON public.media_categories;
CREATE POLICY "Admins manage media categories" ON public.media_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Media Items
DROP POLICY IF EXISTS "Media items readable by all" ON public.media_items;
CREATE POLICY "Media items readable by all" ON public.media_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage media items" ON public.media_items;
CREATE POLICY "Admins manage media items" ON public.media_items FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Featured Talks
DROP POLICY IF EXISTS "Featured talks readable by all" ON public.featured_talks;
CREATE POLICY "Featured talks readable by all" ON public.featured_talks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage featured talks" ON public.featured_talks;
CREATE POLICY "Admins manage featured talks" ON public.featured_talks FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Blogs
DROP POLICY IF EXISTS "Blogs readable by all" ON public.blogs;
CREATE POLICY "Blogs readable by all" ON public.blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage blogs" ON public.blogs;
CREATE POLICY "Admins manage blogs" ON public.blogs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Newsletters
DROP POLICY IF EXISTS "Newsletters readable by all" ON public.newsletters;
CREATE POLICY "Newsletters readable by all" ON public.newsletters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage newsletters" ON public.newsletters;
CREATE POLICY "Admins manage newsletters" ON public.newsletters FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Podcasts
DROP POLICY IF EXISTS "Podcasts readable by all" ON public.podcasts;
CREATE POLICY "Podcasts readable by all" ON public.podcasts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage podcasts" ON public.podcasts;
CREATE POLICY "Admins manage podcasts" ON public.podcasts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Contacts
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contacts;
CREATE POLICY "Anyone can submit contact" ON public.contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view contacts" ON public.contacts;
CREATE POLICY "Admins view contacts" ON public.contacts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage contacts" ON public.contacts;
CREATE POLICY "Admins manage contacts" ON public.contacts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Publishing
DROP POLICY IF EXISTS "Publishing readable by all" ON public.publishing;
CREATE POLICY "Publishing readable by all" ON public.publishing FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage publishing" ON public.publishing;
CREATE POLICY "Admins manage publishing" ON public.publishing FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Works in Progress
DROP POLICY IF EXISTS "Works in progress readable by all" ON public.works_in_progress;
CREATE POLICY "Works in progress readable by all" ON public.works_in_progress FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage works_in_progress" ON public.works_in_progress;
CREATE POLICY "Admins manage works_in_progress" ON public.works_in_progress FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Site Images
DROP POLICY IF EXISTS "Anyone can view site images" ON public.site_images;
CREATE POLICY "Anyone can view site images" ON public.site_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert site images" ON public.site_images;
CREATE POLICY "Admins can insert site images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update site images" ON public.site_images;
CREATE POLICY "Admins can update site images" ON public.site_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete site images" ON public.site_images;
CREATE POLICY "Admins can delete site images" ON public.site_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Payment Methods
DROP POLICY IF EXISTS "Payment methods readable by all" ON public.payment_methods;
CREATE POLICY "Payment methods readable by all" ON public.payment_methods FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage payment_methods" ON public.payment_methods;
CREATE POLICY "Admins manage payment_methods" ON public.payment_methods FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Email Subscriptions
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_subscriptions;
CREATE POLICY "Anyone can subscribe" ON public.email_subscriptions FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view subscriptions" ON public.email_subscriptions;
CREATE POLICY "Admins view subscriptions" ON public.email_subscriptions FOR SELECT TO public USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage subscriptions" ON public.email_subscriptions;
CREATE POLICY "Admins manage subscriptions" ON public.email_subscriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Hero Settings
DROP POLICY IF EXISTS "Hero settings readable by all" ON public.homepage_hero_settings;
CREATE POLICY "Hero settings readable by all" ON public.homepage_hero_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage hero settings" ON public.homepage_hero_settings;
CREATE POLICY "Admins manage hero settings" ON public.homepage_hero_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- About Settings
DROP POLICY IF EXISTS "About settings readable by all" ON public.homepage_about_settings;
CREATE POLICY "About settings readable by all" ON public.homepage_about_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage about settings" ON public.homepage_about_settings;
CREATE POLICY "Admins manage about settings" ON public.homepage_about_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- TEDx Talks
DROP POLICY IF EXISTS "TEDx talks readable by all" ON public.tedx_talk;
CREATE POLICY "TEDx talks readable by all" ON public.tedx_talks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage tedx talks" ON public.tedx_talks;
CREATE POLICY "Admins manage tedx talks" ON public.tedx_talks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Philanthropy Cards
DROP POLICY IF EXISTS "Philanthropy cards readable by all" ON public.philanthropy_cards;
CREATE POLICY "Philanthropy cards readable by all" ON public.philanthropy_cards FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins manage philanthropy cards" ON public.philanthropy_cards;
CREATE POLICY "Admins manage philanthropy cards" ON public.philanthropy_cards FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- 8. AUTO-UPDATE UPDATED_AT COLUMN TRIGGERS
CREATE OR REPLACE PROCEDURE public.create_timestamp_trigger(table_name TEXT)
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I', table_name, table_name);
  EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', table_name, table_name);
END;
$$;

CALL public.create_timestamp_trigger('profiles');
CALL public.create_timestamp_trigger('books');
CALL public.create_timestamp_trigger('courses');
CALL public.create_timestamp_trigger('events');
CALL public.create_timestamp_trigger('media');
CALL public.create_timestamp_trigger('media_categories');
CALL public.create_timestamp_trigger('media_items');
CALL public.create_timestamp_trigger('featured_talks');
CALL public.create_timestamp_trigger('blogs');
CALL public.create_timestamp_trigger('newsletters');
CALL public.create_timestamp_trigger('podcasts');
CALL public.create_timestamp_trigger('publishing');
CALL public.create_timestamp_trigger('works_in_progress');
CALL public.create_timestamp_trigger('site_images');
CALL public.create_timestamp_trigger('payment_methods');
CALL public.create_timestamp_trigger('homepage_hero_settings');
CALL public.create_timestamp_trigger('homepage_about_settings');
CALL public.create_timestamp_trigger('tedx_talks');
CALL public.create_timestamp_trigger('philanthropy_cards');

DROP PROCEDURE public.create_timestamp_trigger(TEXT);

-- 9. STORAGE BUCKET CONFIGURATION & POLICIES

-- Insert site-images and book-files buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-files', 'book-files', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies for 'site-images'
DROP POLICY IF EXISTS "Anyone can view site images" ON storage.objects;
CREATE POLICY "Anyone can view site images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
CREATE POLICY "Admins can upload site images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
CREATE POLICY "Admins can update site images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;
CREATE POLICY "Admins can delete site images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage Policies for 'book-files'
DROP POLICY IF EXISTS "Book file access for buyers and admins" ON storage.objects;
CREATE POLICY "Book file access for buyers and admins" ON storage.objects FOR SELECT TO authenticated
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

DROP POLICY IF EXISTS "Admins can upload book files" ON storage.objects;
CREATE POLICY "Admins can upload book files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete book files" ON storage.objects;
CREATE POLICY "Admins can delete book files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update book files" ON storage.objects;
CREATE POLICY "Admins can update book files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'::app_role));
