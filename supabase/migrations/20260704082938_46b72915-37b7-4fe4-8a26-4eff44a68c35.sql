
-- 1. Storage policies for site-images
DROP POLICY IF EXISTS "Authenticated users can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete site images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;

CREATE POLICY "Public can view site images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Restrict has_role: caller may only check their own uid
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    _user_id IS NOT NULL
    AND _user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    );
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 3. Analytics events: replace WITH CHECK (true) with bounded check
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (
    length(event_name) BETWEEN 1 AND 200
    AND (source IS NULL OR length(source) <= 200)
    AND (session_id IS NULL OR length(session_id) <= 200)
    AND (path IS NULL OR length(path) <= 2000)
    AND (referrer IS NULL OR length(referrer) <= 2000)
  );

-- 4. user_roles: explicit deny for writes by non-service_role, revoke grants
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated, anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "No self-assignment of roles" ON public.user_roles;
CREATE POLICY "No self-assignment of roles"
  ON public.user_roles FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- Recreate the read-own-roles policy (FOR ALL above would supersede; keep separate SELECT)
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 5. consultation_bookings: notified_at guard for email edge function
ALTER TABLE public.consultation_bookings
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

-- 6. contact rate limit log (admin-only readable, service-role writable)
CREATE TABLE IF NOT EXISTS public.contact_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_rate_limit_ip_created_idx
  ON public.contact_rate_limit (ip_hash, created_at DESC);

GRANT ALL ON public.contact_rate_limit TO service_role;
ALTER TABLE public.contact_rate_limit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view contact rate limit" ON public.contact_rate_limit;
CREATE POLICY "Admins can view contact rate limit"
  ON public.contact_rate_limit FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
