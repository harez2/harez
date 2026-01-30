import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ColorSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  usePreset: boolean;
  preset: string;
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  baseFontSize: number;
  headingWeight: string;
  bodyWeight: string;
}

export interface LayoutSettings {
  showHero: boolean;
  showAbout: boolean;
  showSkills: boolean;
  showBrands: boolean;
  showExperience: boolean;
  showBlog: boolean;
  showContact: boolean;
  sectionOrder: string[];
  containerMaxWidth: string;
  sectionSpacing: "sm" | "md" | "lg" | "xl";
}

export interface NavigationSettings {
  showLogo: boolean;
  logoText: string;
  menuItems: string[];
  showThemeToggle: boolean;
  stickyHeader: boolean;
}

export type CustomizationCategory = "colors" | "typography" | "layout" | "navigation";

export const COLOR_PRESETS = {
  crystal: {
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#06b6d4",
    backgroundColor: "#ffffff",
    foregroundColor: "#0f172a",
    mutedColor: "#64748b",
  },
  emerald: {
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    accentColor: "#14b8a6",
    backgroundColor: "#ffffff",
    foregroundColor: "#022c22",
    mutedColor: "#6b7280",
  },
  sunset: {
    primaryColor: "#f97316",
    secondaryColor: "#ef4444",
    accentColor: "#eab308",
    backgroundColor: "#fffbeb",
    foregroundColor: "#1c1917",
    mutedColor: "#78716c",
  },
  rose: {
    primaryColor: "#e11d48",
    secondaryColor: "#be185d",
    accentColor: "#f472b6",
    backgroundColor: "#fff1f2",
    foregroundColor: "#1c1917",
    mutedColor: "#71717a",
  },
  midnight: {
    primaryColor: "#6366f1",
    secondaryColor: "#4f46e5",
    accentColor: "#818cf8",
    backgroundColor: "#0f0f23",
    foregroundColor: "#e2e8f0",
    mutedColor: "#94a3b8",
  },
};

export const FONT_OPTIONS = [
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Outfit", label: "Outfit" },
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Raleway", label: "Raleway" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
];

export const useCustomization = <T>(category: CustomizationCategory) => {
  return useQuery({
    queryKey: ["customizations", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_customizations")
        .select("settings")
        .eq("category", category)
        .single();

      if (error) throw error;
      return data?.settings as T;
    },
  });
};

export const useAllCustomizations = () => {
  return useQuery({
    queryKey: ["customizations", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_customizations")
        .select("category, settings");

      if (error) throw error;
      
      const result: Record<string, any> = {};
      data?.forEach((item) => {
        result[item.category] = item.settings;
      });
      return result as {
        colors: ColorSettings;
        typography: TypographySettings;
        layout: LayoutSettings;
        navigation: NavigationSettings;
      };
    },
  });
};

export const useUpdateCustomization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      category, 
      settings 
    }: { 
      category: CustomizationCategory; 
      settings: any 
    }) => {
      const { error } = await supabase
        .from("site_customizations")
        .update({ settings })
        .eq("category", category);

      if (error) throw error;
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries({ queryKey: ["customizations", category] });
      queryClient.invalidateQueries({ queryKey: ["customizations", "all"] });
    },
  });
};

// Helper to convert hex to HSL
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const hslToString = (hsl: { h: number; s: number; l: number }): string => {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
};
