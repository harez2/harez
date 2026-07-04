CREATE TABLE public.audit_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  website TEXT,
  monthly_ad_spend TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.audit_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.audit_requests TO authenticated;
GRANT ALL ON public.audit_requests TO service_role;

ALTER TABLE public.audit_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit audit request"
  ON public.audit_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (company IS NULL OR length(company) <= 200)
    AND (website IS NULL OR length(website) <= 500)
    AND (monthly_ad_spend IS NULL OR length(monthly_ad_spend) <= 100)
    AND (message IS NULL OR length(message) <= 2000)
  );

CREATE POLICY "Admins can view audit requests"
  ON public.audit_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update audit requests"
  ON public.audit_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete audit requests"
  ON public.audit_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER audit_requests_updated_at
  BEFORE UPDATE ON public.audit_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX audit_requests_created_at_idx ON public.audit_requests (created_at DESC);
CREATE INDEX audit_requests_status_idx ON public.audit_requests (status);