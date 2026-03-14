
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  method_type TEXT NOT NULL DEFAULT 'paypal',
  label TEXT NOT NULL,
  details TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payment_methods" ON public.payment_methods FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Payment methods readable by all" ON public.payment_methods FOR SELECT USING (true);

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.book_orders 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_email TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;
