import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (data && !applied) {
      applyCustomizations(data);
      setApplied(true);
    }
  }, [data, applied]);

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

    // Convert hex to HSL and apply as CSS variables
    const primaryHsl = hexToHsl(colorValues.primaryColor);
    const secondaryHsl = hexToHsl(colorValues.secondaryColor);
    const accentHsl = hexToHsl(colorValues.accentColor);
    const mutedHsl = hexToHsl(colorValues.mutedColor);

    // Apply CSS custom properties for dynamic theming
    root.style.setProperty("--dynamic-primary", `${primaryHsl.h}, ${primaryHsl.s}%, ${primaryHsl.l}%`);
    root.style.setProperty("--dynamic-secondary", `${secondaryHsl.h}, ${secondaryHsl.s}%, ${secondaryHsl.l}%`);
    root.style.setProperty("--dynamic-accent", `${accentHsl.h}, ${accentHsl.s}%, ${accentHsl.l}%`);
    root.style.setProperty("--dynamic-muted", `${mutedHsl.h}, ${mutedHsl.s}%, ${mutedHsl.l}%`);

    // Apply typography
    const typography = customizations.typography;
    
    // Load Google Fonts dynamically
    const fontsToLoad = [typography.headingFont, typography.bodyFont];
    const fontLink = document.getElementById("dynamic-fonts") as HTMLLinkElement;
    
    if (!fontLink) {
      const link = document.createElement("link");
      link.id = "dynamic-fonts";
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad
        .map((f) => f.replace(/\s+/g, "+") + ":wght@300;400;500;600;700;800")
        .join("&family=")}&display=swap`;
      document.head.appendChild(link);
    } else {
      fontLink.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad
        .map((f) => f.replace(/\s+/g, "+") + ":wght@300;400;500;600;700;800")
        .join("&family=")}&display=swap`;
    }

    root.style.setProperty("--font-heading", typography.headingFont);
    root.style.setProperty("--font-body", typography.bodyFont);
    root.style.setProperty("--font-size-base", `${typography.baseFontSize}px`);
    root.style.setProperty("--font-weight-heading", typography.headingWeight);
    root.style.setProperty("--font-weight-body", typography.bodyWeight);

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
