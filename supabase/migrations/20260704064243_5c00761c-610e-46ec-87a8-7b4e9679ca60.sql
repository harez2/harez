
-- 1. Role infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Seed existing users as admin (single-admin site)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Replace permissive write policies with admin-only across content tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'blog_posts','skills','experience','education','brands','site_content',
    'site_customizations','consultation_content','consultation_projects',
    'consultation_reviews','consultation_slots'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert %s" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update %s" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete %s" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert customizations" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update customizations" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete customizations" ON public.%I', t);

    EXECUTE format('CREATE POLICY "Admins can insert %s" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))', t, t);
    EXECUTE format('CREATE POLICY "Admins can update %s" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t, t);
    EXECUTE format('CREATE POLICY "Admins can delete %s" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t, t);
  END LOOP;
END $$;

-- Also drop old blog_posts "view all" policy (admins can see drafts via admin policy below)
DROP POLICY IF EXISTS "Authenticated users can view all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. consultation_bookings: admin-only read/update/delete; public insert only for real, available slots
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Authenticated users can delete bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Anyone can insert consultation bookings" ON public.consultation_bookings;

CREATE POLICY "Admins can view bookings" ON public.consultation_bookings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.consultation_bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings" ON public.consultation_bookings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can create bookings for available slots" ON public.consultation_bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.consultation_slots s WHERE s.id = slot_id AND s.is_available = true)
    AND length(client_name) BETWEEN 1 AND 200
    AND length(client_email) BETWEEN 3 AND 320
    AND length(client_phone) BETWEEN 3 AND 40
    AND length(transaction_id) BETWEEN 1 AND 200
  );

-- 4. Storage: remove listing capability on public site-images bucket (direct URLs still work)
DROP POLICY IF EXISTS "Anyone can view site images" ON storage.objects;
