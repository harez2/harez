
-- Drop remaining legacy permissive write policies (names contained spaces)
DROP POLICY IF EXISTS "Authenticated users can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can delete site content" ON public.site_content;

DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

DROP POLICY IF EXISTS "Authenticated users can insert consultation content" ON public.consultation_content;
DROP POLICY IF EXISTS "Authenticated users can update consultation content" ON public.consultation_content;
DROP POLICY IF EXISTS "Authenticated users can delete consultation content" ON public.consultation_content;

DROP POLICY IF EXISTS "Authenticated users can insert consultation projects" ON public.consultation_projects;
DROP POLICY IF EXISTS "Authenticated users can update consultation projects" ON public.consultation_projects;
DROP POLICY IF EXISTS "Authenticated users can delete consultation projects" ON public.consultation_projects;

DROP POLICY IF EXISTS "Authenticated users can insert consultation reviews" ON public.consultation_reviews;
DROP POLICY IF EXISTS "Authenticated users can update consultation reviews" ON public.consultation_reviews;
DROP POLICY IF EXISTS "Authenticated users can delete consultation reviews" ON public.consultation_reviews;

DROP POLICY IF EXISTS "Authenticated users can insert consultation slots" ON public.consultation_slots;
DROP POLICY IF EXISTS "Authenticated users can update consultation slots" ON public.consultation_slots;
DROP POLICY IF EXISTS "Authenticated users can delete consultation slots" ON public.consultation_slots;

-- Restrict has_role execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
