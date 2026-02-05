import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroContent {
  badge: string;
  name: string;
  nameHighlight: string;
  subtitle: string;
  resumeUrl?: string;
}

export interface AboutContent {
  title: string;
  description: string;
  profileImage: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  display_order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  display_order: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  display_order: number;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
}

export const useSiteContent = <T>(section: string) => {
  return useQuery({
    queryKey: ["site_content", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", section)
        .single();

      if (error) throw error;
      return data?.content as T;
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ section, content }: { section: string; content: any }) => {
      const { error } = await supabase
        .from("site_content")
        .update({ content })
        .eq("section", section);

      if (error) throw error;
    },
    onSuccess: (_, { section }) => {
      queryClient.invalidateQueries({ queryKey: ["site_content", section] });
    },
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as Skill[];
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Partial<Skill> & { id: string }) => {
      const { error } = await supabase
        .from("skills")
        .update(skill)
        .eq("id", skill.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Omit<Skill, "id">) => {
      const { error } = await supabase.from("skills").insert(skill);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

export const useExperience = () => {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as Experience[];
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exp: Partial<Experience> & { id: string }) => {
      const { error } = await supabase
        .from("experience")
        .update(exp)
        .eq("id", exp.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exp: Omit<Experience, "id">) => {
      const { error } = await supabase.from("experience").insert(exp);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
};

// ============ Education Hooks ============

export const useEducation = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as Education[];
    },
  });
};

export const useCreateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (edu: Omit<Education, "id">) => {
      const { error } = await supabase.from("education").insert(edu);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (edu: Partial<Education> & { id: string }) => {
      const { error } = await supabase
        .from("education")
        .update(edu)
        .eq("id", edu.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

// ============ Brand Hooks ============

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as Brand[];
    },
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brand: Omit<Brand, "id">) => {
      const { error } = await supabase.from("brands").insert(brand);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brand: Partial<Brand> & { id: string }) => {
      const { error } = await supabase
        .from("brands")
        .update(brand)
        .eq("id", brand.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const { error } = await supabase.storage.from("site-images").upload(path, file, {
    upsert: true,
  });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("site-images")
    .getPublicUrl(path);

  return publicUrl;
};
