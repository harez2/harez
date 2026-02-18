
-- consultation_content: editable page content (bio, video, benefits)
CREATE TABLE public.consultation_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view consultation content" ON public.consultation_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert consultation content" ON public.consultation_content FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update consultation content" ON public.consultation_content FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete consultation content" ON public.consultation_content FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE TRIGGER update_consultation_content_updated_at BEFORE UPDATE ON public.consultation_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- consultation_projects: previous project showcase
CREATE TABLE public.consultation_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  link TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view consultation projects" ON public.consultation_projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert consultation projects" ON public.consultation_projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update consultation projects" ON public.consultation_projects FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete consultation projects" ON public.consultation_projects FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE TRIGGER update_consultation_projects_updated_at BEFORE UPDATE ON public.consultation_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- consultation_reviews: client testimonials
CREATE TABLE public.consultation_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_photo TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view consultation reviews" ON public.consultation_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert consultation reviews" ON public.consultation_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update consultation reviews" ON public.consultation_reviews FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete consultation reviews" ON public.consultation_reviews FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE TRIGGER update_consultation_reviews_updated_at BEFORE UPDATE ON public.consultation_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- consultation_slots: available booking time slots
CREATE TABLE public.consultation_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available consultation slots" ON public.consultation_slots FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert consultation slots" ON public.consultation_slots FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update consultation slots" ON public.consultation_slots FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete consultation slots" ON public.consultation_slots FOR DELETE USING (auth.uid() IS NOT NULL);

-- consultation_bookings: all bookings
CREATE TABLE public.consultation_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID NOT NULL REFERENCES public.consultation_slots(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert consultation bookings" ON public.consultation_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view all bookings" ON public.consultation_bookings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update bookings" ON public.consultation_bookings FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete bookings" ON public.consultation_bookings FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE TRIGGER update_consultation_bookings_updated_at BEFORE UPDATE ON public.consultation_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
