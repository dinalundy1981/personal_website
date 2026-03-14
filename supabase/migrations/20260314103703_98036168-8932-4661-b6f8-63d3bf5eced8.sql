ALTER TABLE public.course_orders 
  ADD COLUMN phone text,
  ADD COLUMN country text,
  ADD COLUMN payment_method text,
  ADD COLUMN payment_email text,
  ADD COLUMN admin_notes text,
  ADD COLUMN quantity integer NOT NULL DEFAULT 1;