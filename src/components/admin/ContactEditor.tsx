import { useState, useEffect } from "react";
import { useSiteContent, useUpdateSiteContent, ContactContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const ContactEditor = () => {
  const { data: content, isLoading } = useSiteContent<ContactContent>("contact");
  const updateContent = useUpdateSiteContent();
  const [formData, setFormData] = useState<ContactContent>({
    title: "",
    subtitle: "",
    email: "",
  });

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync({ section: "contact", content: formData });
      toast.success("Contact section updated!");
    } catch (error) {
      toast.error("Failed to update contact section");
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
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Contact Section</h2>
        <p className="font-body text-sm text-muted-foreground">
          Edit your contact information and section text.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="font-body text-sm text-foreground block mb-2">Section Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="e.g., Get In Touch"
          />
        </div>

        <div>
          <label className="font-body text-sm text-foreground block mb-2">Subtitle</label>
          <textarea
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            placeholder="Brief description for the contact section"
          />
        </div>

        <div>
          <label className="font-body text-sm text-foreground block mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="your@email.com"
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

export default ContactEditor;
