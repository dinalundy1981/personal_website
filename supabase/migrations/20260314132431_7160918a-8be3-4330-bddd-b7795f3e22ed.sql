CREATE POLICY "Admins manage subscriptions" ON public.email_subscriptions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));