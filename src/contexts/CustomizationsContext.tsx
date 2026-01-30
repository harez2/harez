import { createContext, useContext, useEffect, ReactNode } from "react";
import { useTheme } from "next-themes";
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
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (data) {
      applyCustomizations(data, resolvedTheme === "dark");
    }
  }, [data, resolvedTheme]);

  const applyCustomizations = (
    customizations: {
      colors: ColorSettings;
      typography: TypographySettings;
      layout: LayoutSettings;
      navigation: NavigationSettings;
    },
    isDark: boolean
  ) => {
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

    // Convert hex to HSL
    const primaryHsl = hexToHsl(colorValues.primaryColor);
    const secondaryHsl = hexToHsl(colorValues.secondaryColor);
    const accentHsl = hexToHsl(colorValues.accentColor);
    const mutedHsl = hexToHsl(colorValues.mutedColor);
    const foregroundHsl = hexToHsl(colorValues.foregroundColor);
    const backgroundHsl = hexToHsl(colorValues.backgroundColor);

    // Calculate dark mode variants - invert lightness for bg/fg
    const darkBgHsl = { h: backgroundHsl.h, s: Math.min(backgroundHsl.s + 5, 30), l: Math.max(8, 100 - backgroundHsl.l) };
    const darkFgHsl = { h: foregroundHsl.h, s: Math.max(foregroundHsl.s - 10, 10), l: Math.min(95, 100 - foregroundHsl.l + 80) };
    const darkMutedHsl = { h: mutedHsl.h, s: Math.max(mutedHsl.s - 15, 5), l: 55 };
    const darkPrimaryHsl = { h: primaryHsl.h, s: primaryHsl.s, l: Math.min(primaryHsl.l + 5, 65) };
    const darkSecondaryHsl = { h: secondaryHsl.h, s: Math.max(secondaryHsl.s - 10, 10), l: 18 };
    const darkAccentHsl = { h: accentHsl.h, s: accentHsl.s, l: Math.min(accentHsl.l + 5, 65) };

    // Apply based on current theme
    if (isDark) {
      root.style.setProperty("--primary", `${darkPrimaryHsl.h} ${darkPrimaryHsl.s}% ${darkPrimaryHsl.l}%`);
      root.style.setProperty("--primary-foreground", `${darkBgHsl.h} ${darkBgHsl.s}% ${darkBgHsl.l}%`);
      root.style.setProperty("--secondary", `${darkSecondaryHsl.h} ${darkSecondaryHsl.s}% ${darkSecondaryHsl.l}%`);
      root.style.setProperty("--secondary-foreground", `${darkFgHsl.h} ${darkFgHsl.s}% ${darkFgHsl.l}%`);
      root.style.setProperty("--accent", `${darkAccentHsl.h} ${darkAccentHsl.s}% ${darkAccentHsl.l}%`);
      root.style.setProperty("--accent-foreground", `${darkBgHsl.h} ${darkBgHsl.s}% ${darkBgHsl.l}%`);
      root.style.setProperty("--muted", `${darkBgHsl.h} ${darkBgHsl.s}% 20%`);
      root.style.setProperty("--muted-foreground", `${darkMutedHsl.h} ${darkMutedHsl.s}% ${darkMutedHsl.l}%`);
      root.style.setProperty("--foreground", `${darkFgHsl.h} ${darkFgHsl.s}% ${darkFgHsl.l}%`);
      root.style.setProperty("--background", `${darkBgHsl.h} ${darkBgHsl.s}% ${darkBgHsl.l}%`);
      root.style.setProperty("--card", `${darkBgHsl.h} ${darkBgHsl.s}% 12%`);
      root.style.setProperty("--card-foreground", `${darkFgHsl.h} ${darkFgHsl.s}% ${darkFgHsl.l}%`);
      root.style.setProperty("--popover", `${darkBgHsl.h} ${darkBgHsl.s}% 12%`);
      root.style.setProperty("--popover-foreground", `${darkFgHsl.h} ${darkFgHsl.s}% ${darkFgHsl.l}%`);
      root.style.setProperty("--border", `${darkBgHsl.h} ${darkBgHsl.s}% 20%`);
      root.style.setProperty("--input", `${darkBgHsl.h} ${darkBgHsl.s}% 20%`);
      root.style.setProperty("--ring", `${darkPrimaryHsl.h} ${darkPrimaryHsl.s}% ${darkPrimaryHsl.l}%`);
    } else {
      root.style.setProperty("--primary", `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
      root.style.setProperty("--primary-foreground", `0 0% 100%`);
      root.style.setProperty("--secondary", `${secondaryHsl.h} ${Math.max(secondaryHsl.s - 70, 15)}% 94%`);
      root.style.setProperty("--secondary-foreground", `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
      root.style.setProperty("--accent", `${accentHsl.h} ${accentHsl.s}% ${accentHsl.l}%`);
      root.style.setProperty("--accent-foreground", `0 0% 100%`);
      root.style.setProperty("--muted", `${backgroundHsl.h} ${Math.max(backgroundHsl.s - 5, 10)}% 92%`);
      root.style.setProperty("--muted-foreground", `${mutedHsl.h} ${mutedHsl.s}% ${mutedHsl.l}%`);
      root.style.setProperty("--foreground", `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
      root.style.setProperty("--background", `${backgroundHsl.h} ${backgroundHsl.s}% ${backgroundHsl.l}%`);
      root.style.setProperty("--card", `0 0% 100%`);
      root.style.setProperty("--card-foreground", `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
      root.style.setProperty("--popover", `0 0% 100%`);
      root.style.setProperty("--popover-foreground", `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
      root.style.setProperty("--border", `${backgroundHsl.h} ${Math.max(backgroundHsl.s - 5, 10)}% 90%`);
      root.style.setProperty("--input", `${backgroundHsl.h} ${Math.max(backgroundHsl.s - 5, 10)}% 90%`);
      root.style.setProperty("--ring", `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
    }
    
    // Update gradient variables
    const gradientPrimary = isDark ? darkPrimaryHsl : primaryHsl;
    const gradientSecondary = isDark ? darkSecondaryHsl : secondaryHsl;
    root.style.setProperty(
      "--gradient-crystal", 
      `linear-gradient(135deg, hsl(${gradientPrimary.h}, ${gradientPrimary.s}%, ${gradientPrimary.l}%), hsl(${gradientSecondary.h}, ${gradientSecondary.s}%, ${Math.min(gradientSecondary.l + 20, 60)}%))`
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
