
-- Add close_date to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS close_date timestamp with time zone;

-- Create event_images table for multiple images per event
CREATE TABLE public.event_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event images readable by all" ON public.event_images FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage event images" ON public.event_images FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Add contact fields to event_registrations
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS location text;

-- Allow anyone (authenticated) to insert event registrations, also allow anon insert for non-logged-in users
DROP POLICY IF EXISTS "Users register themselves" ON public.event_registrations;
CREATE POLICY "Anyone can register interest" ON public.event_registrations FOR INSERT TO public WITH CHECK (true);

-- Make user_id nullable so non-logged-in users can register
ALTER TABLE public.event_registrations ALTER COLUMN user_id DROP NOT NULL;
