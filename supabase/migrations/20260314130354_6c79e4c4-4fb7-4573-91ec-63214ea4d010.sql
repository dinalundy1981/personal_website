
CREATE TABLE public.philanthropy_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  link_url text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.philanthropy_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage philanthropy cards" ON public.philanthropy_cards FOR ALL TO public USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Philanthropy cards readable by all" ON public.philanthropy_cards FOR SELECT TO public USING (true);

CREATE TRIGGER update_philanthropy_cards_updated_at BEFORE UPDATE ON public.philanthropy_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
