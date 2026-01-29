-- Create blog_posts table for blogs and case studies
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT NOT NULL DEFAULT 'blog' CHECK (category IN ('blog', 'case_study')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies: public can read published posts
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (status = 'published');

-- Authenticated users can view all posts (including drafts) for admin
CREATE POLICY "Authenticated users can view all blog posts"
ON public.blog_posts
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert blog posts
CREATE POLICY "Authenticated users can insert blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update blog posts
CREATE POLICY "Authenticated users can update blog posts"
ON public.blog_posts
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Authenticated users can delete blog posts
CREATE POLICY "Authenticated users can delete blog posts"
ON public.blog_posts
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on slug for fast lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Create index on status and published_at for listing queries
CREATE INDEX idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);