import { useState, useEffect } from "react";
import { useSiteContent, useUpdateSiteContent, HeroContent, uploadImage } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Loader2, Save, Upload, FileText, X } from "lucide-react";

const HeroEditor = () => {
  const { data: content, isLoading } = useSiteContent<HeroContent>("hero");
  const updateContent = useUpdateSiteContent();
  const [formData, setFormData] = useState<HeroContent>({
    badge: "",
    name: "",
    nameHighlight: "",
    subtitle: "",
    resumeUrl: "",
    headline: "",
    headlineHighlight: "",
    headlineSuffix: "",
    primaryCtaLabel: "",
    primaryCtaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    stat1Value: "",
    stat1Label: "",
    stat2Value: "",
    stat2Label: "",
    stat3Value: "",
    stat3Label: "",
  });
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        headline: "",
        headlineHighlight: "",
        headlineSuffix: "",
        primaryCtaLabel: "",
        primaryCtaHref: "",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        stat1Value: "",
        stat1Label: "",
        stat2Value: "",
        stat2Label: "",
        stat3Value: "",
        stat3Label: "",
        ...content,
        resumeUrl: content.resumeUrl || "",
      });
    }
  }, [content]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadingResume(true);
    try {
      const resumePath = `resume/${Date.now()}-${file.name}`;
      const resumeUrl = await uploadImage(file, resumePath);
      setFormData({ ...formData, resumeUrl });
      toast.success("Resume uploaded! Don't forget to save changes.");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleRemoveResume = () => {
    setFormData({ ...formData, resumeUrl: "" });
  };

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

        {/* Headline */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-display text-sm font-semibold text-foreground mb-3">Main Headline</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              value={formData.headline || ""}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
              placeholder="Prefix (e.g., Scale your business with)"
            />
            <input
              type="text"
              value={formData.headlineHighlight || ""}
              onChange={(e) => setFormData({ ...formData, headlineHighlight: e.target.value })}
              className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
              placeholder="Highlighted word (e.g., data-driven)"
            />
            <input
              type="text"
              value={formData.headlineSuffix || ""}
              onChange={(e) => setFormData({ ...formData, headlineSuffix: e.target.value })}
              className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
              placeholder="Suffix (e.g., performance marketing)"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-display text-sm font-semibold text-foreground mb-3">Call-to-Action Buttons</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={formData.primaryCtaLabel || ""}
              onChange={(e) => setFormData({ ...formData, primaryCtaLabel: e.target.value })}
              className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
              placeholder="Primary button label"
            />
            <input
              type="text"
              value={formData.primaryCtaHref || ""}
              onChange={(e) => setFormData({ ...formData, primaryCtaHref: e.target.value })}
              className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
              placeholder="Primary link (e.g., #lead-magnet)"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.secondaryCtaLabel || ""}
              onChange={(e) => setFormData({ ...formData, secondaryCtaLabel: e.target.value })}
              className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
              placeholder="Secondary button label"
            />
            <input
              type="text"
              value={formData.secondaryCtaHref || ""}
              onChange={(e) => setFormData({ ...formData, secondaryCtaHref: e.target.value })}
              className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
              placeholder="Secondary link (e.g., #case-studies)"
            />
          </div>
        </div>

        {/* Trust Stats */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-display text-sm font-semibold text-foreground mb-3">Trust Stats</h3>
          {([1, 2, 3] as const).map((i) => {
            const valueKey = `stat${i}Value` as const;
            const labelKey = `stat${i}Label` as const;
            return (
              <div key={i} className="grid md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={(formData[valueKey] as string) || ""}
                  onChange={(e) => setFormData({ ...formData, [valueKey]: e.target.value })}
                  className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
                  placeholder={`Stat ${i} value (e.g., $500K+)`}
                />
                <input
                  type="text"
                  value={(formData[labelKey] as string) || ""}
                  onChange={(e) => setFormData({ ...formData, [labelKey]: e.target.value })}
                  className="px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground focus:outline-none focus:border-primary transition-all"
                  placeholder={`Stat ${i} label (e.g., Ad spend)`}
                />
              </div>
            );
          })}
        </div>

        {/* Resume Upload */}
        <div className="pt-4 border-t border-border">
          <label className="font-body text-sm text-foreground block mb-2">Resume / CV</label>
          <p className="font-body text-xs text-muted-foreground mb-3">
            Upload your resume for visitors to download. Supports PDF and Word documents.
          </p>
          
          {formData.resumeUrl ? (
            <div className="flex items-center gap-3 p-4 bg-secondary/50 border border-border rounded-xl">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground truncate">Resume uploaded</p>
                <a 
                  href={formData.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-body text-xs text-primary hover:underline"
                >
                  View current resume
                </a>
              </div>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all">
              {uploadingResume ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-body text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <span className="font-body text-sm">Click to upload resume</span>
                  <span className="font-body text-xs">PDF or Word (max 10MB)</span>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={uploadingResume}
              />
            </label>
          )}
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
