import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category: "blog" | "case_study";
  status: "draft" | "published";
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  display_order: number;
}

export type BlogPostInsert = Omit<BlogPost, "id" | "created_at" | "updated_at">;
export type BlogPostUpdate = Partial<BlogPostInsert> & { id: string };

// Fetch all published blog posts (public)
export const useBlogPosts = (category?: "blog" | "case_study") => {
  return useQuery({
    queryKey: ["blog_posts", "published", category],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

// Fetch single blog post by slug (public)
export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog_posts", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug,
  });
};

// Fetch all blog posts including drafts (admin)
export const useAdminBlogPosts = () => {
  return useQuery({
    queryKey: ["blog_posts", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

// Create new blog post
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPostInsert) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
  });
};

// Update existing blog post
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...post }: BlogPostUpdate) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(post)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
  });
};

// Delete blog post
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
  });
};

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};
