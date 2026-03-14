CREATE TABLE public.email_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.email_subscriptions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins view subscriptions" ON public.email_subscriptions
  FOR SELECT TO public USING (public.has_role(auth.uid(), 'admin'::app_role));