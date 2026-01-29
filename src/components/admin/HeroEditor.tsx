import { useState, useEffect } from "react";
import { useSiteContent, useUpdateSiteContent, HeroContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const HeroEditor = () => {
  const { data: content, isLoading } = useSiteContent<HeroContent>("hero");
  const updateContent = useUpdateSiteContent();
  const [formData, setFormData] = useState<HeroContent>({
    badge: "",
    name: "",
    nameHighlight: "",
    subtitle: "",
  });

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync({ section: "hero", content: formData });
      toast.success("Hero section updated!");
    } catch (error) {
      toast.error("Failed to update hero section");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Hero Section</h2>
        <p className="font-body text-sm text-muted-foreground">
          Edit the main hero section of your portfolio.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="font-body text-sm text-foreground block mb-2">Badge Text</label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="e.g., Digital Marketing Manager"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="font-body text-sm text-foreground block mb-2">Name (First Part)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              placeholder="e.g., Md Harez"
            />
          </div>
          <div>
            <label className="font-body text-sm text-foreground block mb-2">Name (Highlighted Part)</label>
            <input
              type="text"
              value={formData.nameHighlight}
              onChange={(e) => setFormData({ ...formData, nameHighlight: e.target.value })}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              placeholder="e.g., Al Baki"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-foreground block mb-2">Subtitle</label>
          <textarea
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            placeholder="Your tagline or brief description"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={updateContent.isPending}
        className="px-6 py-3 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-xl shadow-crystal hover:shadow-glow transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
      >
        {updateContent.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
};

export default HeroEditor;
