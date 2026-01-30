-- Create site_customizations table for storing theme and layout settings
CREATE TABLE public.site_customizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(category)
);

-- Enable RLS
ALTER TABLE public.site_customizations ENABLE ROW LEVEL SECURITY;

-- Anyone can view customizations (needed for public site styling)
CREATE POLICY "Anyone can view site customizations" 
ON public.site_customizations 
FOR SELECT 
USING (true);

-- Only authenticated users can modify customizations
CREATE POLICY "Authenticated users can insert customizations" 
ON public.site_customizations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update customizations" 
ON public.site_customizations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete customizations" 
ON public.site_customizations 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_site_customizations_updated_at
BEFORE UPDATE ON public.site_customizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default customization categories
INSERT INTO public.site_customizations (category, settings) VALUES
('colors', '{
  "primaryColor": "#3b82f6",
  "secondaryColor": "#8b5cf6",
  "accentColor": "#06b6d4",
  "backgroundColor": "#ffffff",
  "foregroundColor": "#0f172a",
  "mutedColor": "#64748b",
  "usePreset": true,
  "preset": "crystal"
}'::jsonb),
('typography', '{
  "headingFont": "Space Grotesk",
  "bodyFont": "Outfit",
  "baseFontSize": 16,
  "headingWeight": "700",
  "bodyWeight": "400"
}'::jsonb),
('layout', '{
  "showHero": true,
  "showAbout": true,
  "showSkills": true,
  "showBrands": true,
  "showExperience": true,
  "showBlog": true,
  "showContact": true,
  "sectionOrder": ["hero", "about", "skills", "brands", "experience", "blog", "contact"],
  "containerMaxWidth": "1200px",
  "sectionSpacing": "lg"
}'::jsonb),
('navigation', '{
  "showLogo": true,
  "logoText": "HAB",
  "menuItems": ["About", "Skills", "Experience", "Blog", "Contact"],
  "showThemeToggle": true,
  "stickyHeader": true
}'::jsonb);