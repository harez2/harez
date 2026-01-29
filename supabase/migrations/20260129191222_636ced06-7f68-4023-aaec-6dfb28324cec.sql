-- Create site_content table for general content (hero, about, contact info)
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experience table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  achievements TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Enable RLS on all tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view the site content)
CREATE POLICY "Anyone can view site content" 
ON public.site_content 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view experience" 
ON public.experience 
FOR SELECT 
USING (true);

-- Admin write policies (authenticated users can modify)
CREATE POLICY "Authenticated users can insert site content" 
ON public.site_content 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update site content" 
ON public.site_content 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete site content" 
ON public.site_content 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert skills" 
ON public.skills 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills" 
ON public.skills 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete skills" 
ON public.skills 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert experience" 
ON public.experience 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update experience" 
ON public.experience 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete experience" 
ON public.experience 
FOR DELETE 
TO authenticated 
USING (true);

-- Storage policies for site-images bucket
CREATE POLICY "Anyone can view site images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can upload site images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can update site images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can delete site images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'site-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experience_updated_at
BEFORE UPDATE ON public.experience
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site content
INSERT INTO public.site_content (section, content) VALUES
('hero', '{"badge": "Digital Marketing Manager", "name": "Md Harez", "nameHighlight": "Al Baki", "subtitle": "Driving growth through data-driven campaigns. 5+ years of expertise in media buying, lead generation, and performance marketing."}'::jsonb),
('about', '{"title": "About Me", "description": "I am a passionate digital marketing professional with over 5 years of experience in driving measurable results for businesses across various industries.", "profileImage": ""}'::jsonb),
('contact', '{"title": "Get In Touch", "subtitle": "Have a project in mind? Let''s discuss how I can help you achieve your marketing goals.", "email": "harezalbaki@gmail.com"}'::jsonb);

-- Insert default skills
INSERT INTO public.skills (name, category, display_order) VALUES
('Facebook Ads', 'Paid Advertising', 1),
('Google Ads', 'Paid Advertising', 2),
('TikTok Ads', 'Paid Advertising', 3),
('LinkedIn Ads', 'Paid Advertising', 4),
('SEO', 'Organic Marketing', 5),
('Content Marketing', 'Organic Marketing', 6),
('Email Marketing', 'Organic Marketing', 7),
('Google Analytics', 'Analytics', 8),
('Data Studio', 'Analytics', 9),
('A/B Testing', 'Analytics', 10);

-- Insert default experience
INSERT INTO public.experience (company, role, period, description, achievements, display_order) VALUES
('Marketing Agency', 'Senior Digital Marketing Manager', '2022 - Present', 'Leading digital marketing strategies for enterprise clients.', ARRAY['Increased ROI by 150%', 'Managed $500K+ monthly ad spend', 'Led team of 5 marketers'], 1),
('Tech Startup', 'Digital Marketing Specialist', '2020 - 2022', 'Developed and executed multi-channel marketing campaigns.', ARRAY['Grew social following by 300%', 'Reduced CAC by 40%', 'Launched 50+ successful campaigns'], 2),
('Freelance', 'Marketing Consultant', '2018 - 2020', 'Provided marketing consultation to small businesses.', ARRAY['Served 30+ clients', 'Generated $2M+ in client revenue', 'Built marketing automation systems'], 3);