import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Palette, Type, Layout, Menu, Save, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAllCustomizations,
  useUpdateCustomization,
  COLOR_PRESETS,
  FONT_OPTIONS,
  ColorSettings,
  TypographySettings,
  LayoutSettings,
  NavigationSettings,
} from "@/hooks/useCustomizations";

type SubTab = "colors" | "typography" | "layout" | "navigation";

const CustomizationsEditor = () => {
  const { data: customizations, isLoading } = useAllCustomizations();
  const updateMutation = useUpdateCustomization();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("colors");

  const [colors, setColors] = useState<ColorSettings | null>(null);
  const [typography, setTypography] = useState<TypographySettings | null>(null);
  const [layout, setLayout] = useState<LayoutSettings | null>(null);
  const [navigation, setNavigation] = useState<NavigationSettings | null>(null);

  // Initialize local state when data loads
  if (customizations && !colors) {
    setColors(customizations.colors);
    setTypography(customizations.typography);
    setLayout(customizations.layout);
    setNavigation(customizations.navigation);
  }

  const handleSaveColors = async () => {
    if (!colors) return;
    try {
      await updateMutation.mutateAsync({ category: "colors", settings: colors });
      toast.success("Color settings saved!");
    } catch (error) {
      toast.error("Failed to save colors");
    }
  };

  const handleSaveTypography = async () => {
    if (!typography) return;
    try {
      await updateMutation.mutateAsync({ category: "typography", settings: typography });
      toast.success("Typography settings saved!");
    } catch (error) {
      toast.error("Failed to save typography");
    }
  };

  const handleSaveLayout = async () => {
    if (!layout) return;
    try {
      await updateMutation.mutateAsync({ category: "layout", settings: layout });
      toast.success("Layout settings saved!");
    } catch (error) {
      toast.error("Failed to save layout");
    }
  };

  const handleSaveNavigation = async () => {
    if (!navigation) return;
    try {
      await updateMutation.mutateAsync({ category: "navigation", settings: navigation });
      toast.success("Navigation settings saved!");
    } catch (error) {
      toast.error("Failed to save navigation");
    }
  };

  const applyPreset = (presetName: string) => {
    const preset = COLOR_PRESETS[presetName as keyof typeof COLOR_PRESETS];
    if (preset && colors) {
      setColors({
        ...colors,
        ...preset,
        usePreset: true,
        preset: presetName,
      });
    }
  };

  const subTabs = [
    { id: "colors" as SubTab, label: "Colors", icon: Palette },
    { id: "typography" as SubTab, label: "Typography", icon: Type },
    { id: "layout" as SubTab, label: "Layout", icon: Layout },
    { id: "navigation" as SubTab, label: "Navigation", icon: Menu },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Site Customizations
        </h2>
        <p className="text-muted-foreground font-body">
          Customize colors, typography, layout, and navigation settings.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-body text-sm flex items-center gap-2 transition-all ${
              activeSubTab === tab.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {activeSubTab === "colors" && colors && (
        <div className="space-y-6">
          {/* Presets */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Color Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(COLOR_PRESETS).map(([name, preset]) => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className={`p-3 rounded-lg border transition-all ${
                    colors.preset === name
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.secondaryColor }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                  </div>
                  <span className="text-xs font-medium capitalize">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <Label className="text-base font-semibold">Use Custom Colors</Label>
              <p className="text-sm text-muted-foreground">
                Override preset with your own colors
              </p>
            </div>
            <Switch
              checked={!colors.usePreset}
              onCheckedChange={(checked) =>
                setColors({ ...colors, usePreset: !checked })
              }
            />
          </div>

          {/* Custom Color Pickers */}
          {!colors.usePreset && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "primaryColor", label: "Primary Color" },
                { key: "secondaryColor", label: "Secondary Color" },
                { key: "accentColor", label: "Accent Color" },
                { key: "backgroundColor", label: "Background Color" },
                { key: "foregroundColor", label: "Foreground Color" },
                { key: "mutedColor", label: "Muted Color" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colors[key as keyof ColorSettings] as string}
                      onChange={(e) =>
                        setColors({ ...colors, [key]: e.target.value })
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={colors[key as keyof ColorSettings] as string}
                      onChange={(e) =>
                        setColors({ ...colors, [key]: e.target.value })
                      }
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleSaveColors} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Colors
          </Button>
        </div>
      )}

      {/* Typography Tab */}
      {activeSubTab === "typography" && typography && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Heading Font</Label>
              <Select
                value={typography.headingFont}
                onValueChange={(value) =>
                  setTypography({ ...typography, headingFont: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Body Font</Label>
              <Select
                value={typography.bodyFont}
                onValueChange={(value) =>
                  setTypography({ ...typography, bodyFont: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Base Font Size (px)</Label>
              <Input
                type="number"
                min={12}
                max={24}
                value={typography.baseFontSize}
                onChange={(e) =>
                  setTypography({
                    ...typography,
                    baseFontSize: parseInt(e.target.value) || 16,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Heading Weight</Label>
              <Select
                value={typography.headingWeight}
                onValueChange={(value) =>
                  setTypography({ ...typography, headingWeight: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                  <SelectItem value="800">Extra Bold (800)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Body Weight</Label>
              <Select
                value={typography.bodyWeight}
                onValueChange={(value) =>
                  setTypography({ ...typography, bodyWeight: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6 border border-border rounded-lg bg-card">
            <h4 className="text-lg font-semibold mb-2">Typography Preview</h4>
            <h1
              style={{
                fontFamily: typography.headingFont,
                fontWeight: typography.headingWeight,
                fontSize: `${typography.baseFontSize * 2}px`,
              }}
              className="mb-2"
            >
              Heading Preview
            </h1>
            <p
              style={{
                fontFamily: typography.bodyFont,
                fontWeight: typography.bodyWeight,
                fontSize: `${typography.baseFontSize}px`,
              }}
            >
              This is how your body text will look with the selected font and weight
              settings. The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          <Button onClick={handleSaveTypography} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Typography
          </Button>
        </div>
      )}

      {/* Layout Tab */}
      {activeSubTab === "layout" && layout && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Section Visibility</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "showHero", label: "Hero Section" },
                { key: "showAbout", label: "About Section" },
                { key: "showSkills", label: "Skills Section" },
                { key: "showBrands", label: "Brands Section" },
                { key: "showExperience", label: "Experience Section" },
                { key: "showBlog", label: "Blog Section" },
                { key: "showContact", label: "Contact Section" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <Label>{label}</Label>
                  <Switch
                    checked={layout[key as keyof LayoutSettings] as boolean}
                    onCheckedChange={(checked) =>
                      setLayout({ ...layout, [key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Container Max Width</Label>
              <Select
                value={layout.containerMaxWidth}
                onValueChange={(value) =>
                  setLayout({ ...layout, containerMaxWidth: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024px">Narrow (1024px)</SelectItem>
                  <SelectItem value="1200px">Default (1200px)</SelectItem>
                  <SelectItem value="1400px">Wide (1400px)</SelectItem>
                  <SelectItem value="1600px">Extra Wide (1600px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section Spacing</Label>
              <Select
                value={layout.sectionSpacing}
                onValueChange={(value) =>
                  setLayout({
                    ...layout,
                    sectionSpacing: value as LayoutSettings["sectionSpacing"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Compact</SelectItem>
                  <SelectItem value="md">Normal</SelectItem>
                  <SelectItem value="lg">Spacious</SelectItem>
                  <SelectItem value="xl">Extra Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveLayout} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Layout
          </Button>
        </div>
      )}

      {/* Navigation Tab */}
      {activeSubTab === "navigation" && navigation && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Logo Text</Label>
              <Input
                value={navigation.logoText}
                onChange={(e) =>
                  setNavigation({ ...navigation, logoText: e.target.value })
                }
                placeholder="HAB"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <Label>Show Logo</Label>
              <Switch
                checked={navigation.showLogo}
                onCheckedChange={(checked) =>
                  setNavigation({ ...navigation, showLogo: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <Label>Show Theme Toggle</Label>
              <Switch
                checked={navigation.showThemeToggle}
                onCheckedChange={(checked) =>
                  setNavigation({ ...navigation, showThemeToggle: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <Label>Sticky Header</Label>
              <Switch
                checked={navigation.stickyHeader}
                onCheckedChange={(checked) =>
                  setNavigation({ ...navigation, stickyHeader: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Menu Items</Label>
            <p className="text-sm text-muted-foreground">
              Comma-separated list of menu items
            </p>
            <Input
              value={navigation.menuItems.join(", ")}
              onChange={(e) =>
                setNavigation({
                  ...navigation,
                  menuItems: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              placeholder="About, Skills, Experience, Blog, Contact"
            />
          </div>

          <Button onClick={handleSaveNavigation} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Navigation
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomizationsEditor;
