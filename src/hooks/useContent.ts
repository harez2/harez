import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  rating: number;
  display_order: number;
  published: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  published: boolean;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  bullets: string[];
  badge: string | null;
  file_path: string | null;
  display_order: number;
  published: boolean;
}

export interface CaseStudyMetric { k: string; v: string }
export interface CaseStudyStrategy { title: string; description: string }
export interface CaseStudyTestimonial { quote: string; author: string; role: string }

export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  industry: string;
  tagline: string;
  problem: string;
  result: string;
  timeline: string | null;
  approach: string[];
  strategy: CaseStudyStrategy[];
  metrics: CaseStudyMetric[];
  services: string[];
  testimonial: CaseStudyTestimonial | null;
  display_order: number;
  published: boolean;
}

/* ---------- PUBLIC READ HOOKS ---------- */
export const useTestimonials = () =>
  useQuery({
    queryKey: ["testimonials", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("display_order");
      if (error) throw error;
      return data as Testimonial[];
    },
  });

export const useFaqs = () =>
  useQuery({
    queryKey: ["faqs", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("published", true)
        .order("display_order");
      if (error) throw error;
      return data as Faq[];
    },
  });

export const useResources = () =>
  useQuery({
    queryKey: ["resources", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("published", true)
        .order("display_order");
      if (error) throw error;
      return data as unknown as Resource[];
    },
  });

export const useCaseStudies = () =>
  useQuery({
    queryKey: ["case_studies", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .order("display_order");
      if (error) throw error;
      return data as unknown as CaseStudy[];
    },
  });

export const useCaseStudyBySlug = (slug: string) =>
  useQuery({
    queryKey: ["case_studies", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as CaseStudy | null;
    },
    enabled: !!slug,
  });

/* ---------- ADMIN READ ---------- */
const adminList = <T,>(table: "testimonials" | "faqs" | "resources" | "case_studies") =>
  useQuery({
    queryKey: [table, "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as unknown as T[];
    },
  });

export const useAdminTestimonials = () => adminList<Testimonial>("testimonials");
export const useAdminFaqs = () => adminList<Faq>("faqs");
export const useAdminResources = () => adminList<Resource>("resources");
export const useAdminCaseStudies = () => adminList<CaseStudy>("case_studies");

/* ---------- ADMIN MUTATIONS ---------- */
type TableName = "testimonials" | "faqs" | "resources" | "case_studies";

export const useUpsertRow = (table: TableName) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Record<string, unknown> & { id?: string }) => {
      const query =
        row.id
          ? supabase.from(table).update(row).eq("id", row.id).select().single()
          : supabase.from(table).insert(row).select().single();
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
    },
  });
};

export const useDeleteRow = (table: TableName) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
    },
  });
};

/** Turn a private storage path into a short-lived signed URL. */
export const getResourceSignedUrl = async (path: string, expiresIn = 60 * 10) => {
  const { data, error } = await supabase.storage
    .from("resources")
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
};