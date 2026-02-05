-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, authenticated write)
CREATE POLICY "Education is viewable by everyone" 
ON public.education 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert education" 
ON public.education 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update education" 
ON public.education 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete education" 
ON public.education 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.education (degree, institution, period, display_order) VALUES
('MBA in Marketing', 'IBA - Jahangirnagar University', '2022 – Present', 0),
('M.Sc. in Mathematics', 'National University', '2019', 1),
('B.Sc. in Mathematics', 'National University', '2018', 2);