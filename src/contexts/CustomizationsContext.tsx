import { createContext, useContext, useEffect, ReactNode } from "react";
import {
  useAllCustomizations,
  ColorSettings,
  TypographySettings,
  LayoutSettings,
  NavigationSettings,
  COLOR_PRESETS,
  hexToHsl,
} from "@/hooks/useCustomizations";

interface CustomizationsContextType {
  colors: ColorSettings | null;
  typography: TypographySettings | null;
  layout: LayoutSettings | null;
  navigation: NavigationSettings | null;
  isLoading: boolean;
}

const CustomizationsContext = createContext<CustomizationsContextType>({
  colors: null,
  typography: null,
  layout: null,
  navigation: null,
  isLoading: true,
});

export const useCustomizationsContext = () => useContext(CustomizationsContext);

export const CustomizationsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useAllCustomizations();

  useEffect(() => {
    if (data) {
      applyCustomizations(data);
    }
  }, [data]);

  const applyCustomizations = (customizations: {
    colors: ColorSettings;
    typography: TypographySettings;
    layout: LayoutSettings;
    navigation: NavigationSettings;
  }) => {
    const root = document.documentElement;

    // Apply colors
    const colors = customizations.colors;
    let colorValues = colors;
    
    if (colors.usePreset && colors.preset) {
      const preset = COLOR_PRESETS[colors.preset as keyof typeof COLOR_PRESETS];
      if (preset) {
        colorValues = { ...colors, ...preset };
      }
    }

    // Convert hex to HSL and apply DIRECTLY to Tailwind CSS variables
    const primaryHsl = hexToHsl(colorValues.primaryColor);
    const secondaryHsl = hexToHsl(colorValues.secondaryColor);
    const accentHsl = hexToHsl(colorValues.accentColor);
    const mutedHsl = hexToHsl(colorValues.mutedColor);
    const foregroundHsl = hexToHsl(colorValues.foregroundColor);
    const backgroundHsl = hexToHsl(colorValues.backgroundColor);

    // Override the actual Tailwind CSS variables
    root.style.setProperty("--primary", `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
    root.style.setProperty("--primary-foreground", `${backgroundHsl.h} ${backgroundHsl.s}% ${Math.min(backgroundHsl.l + 95, 100)}%`);
    root.style.setProperty("--secondary", `${secondaryHsl.h} ${secondaryHsl.s}% ${secondaryHsl.l}%`);
    root.style.setProperty("--accent", `${accentHsl.h} ${accentHsl.s}% ${accentHsl.l}%`);
    root.style.setProperty("--muted", `${mutedHsl.h} ${mutedHsl.s}% ${mutedHsl.l}%`);
    root.style.setProperty("--muted-foreground", `${mutedHsl.h} ${Math.max(mutedHsl.s - 20, 0)}% ${mutedHsl.l}%`);
    root.style.setProperty("--foreground", `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
    root.style.setProperty("--background", `${backgroundHsl.h} ${backgroundHsl.s}% ${backgroundHsl.l}%`);
    
    // Update gradient variables
    root.style.setProperty(
      "--gradient-crystal", 
      `linear-gradient(135deg, hsl(${primaryHsl.h}, ${primaryHsl.s}%, ${primaryHsl.l}%), hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, ${secondaryHsl.l}%))`
    );

    // Apply typography
    const typography = customizations.typography;
    
    // Load Google Fonts dynamically
    const fontsToLoad = [typography.headingFont, typography.bodyFont];
    const fontLink = document.getElementById("dynamic-fonts") as HTMLLinkElement;
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontsToLoad
      .map((f) => f.replace(/\s+/g, "+") + ":wght@300;400;500;600;700;800")
      .join("&family=")}&display=swap`;
    
    if (!fontLink) {
      const link = document.createElement("link");
      link.id = "dynamic-fonts";
      link.rel = "stylesheet";
      link.href = fontUrl;
      document.head.appendChild(link);
    } else {
      fontLink.href = fontUrl;
    }

    // Update font family CSS variables
    root.style.setProperty("--font-display", `"${typography.headingFont}", sans-serif`);
    root.style.setProperty("--font-body", `"${typography.bodyFont}", sans-serif`);
    root.style.fontSize = `${typography.baseFontSize}px`;

    // Apply layout
    const layout = customizations.layout;
    const spacingMap = {
      sm: "4rem",
      md: "6rem",
      lg: "8rem",
      xl: "10rem",
    };
    root.style.setProperty("--container-max-width", layout.containerMaxWidth);
    root.style.setProperty("--section-spacing", spacingMap[layout.sectionSpacing] || "6rem");
  };

  return (
    <CustomizationsContext.Provider
      value={{
        colors: data?.colors || null,
        typography: data?.typography || null,
        layout: data?.layout || null,
        navigation: data?.navigation || null,
        isLoading,
      }}
    >
      {children}
    </CustomizationsContext.Provider>
  );
};
