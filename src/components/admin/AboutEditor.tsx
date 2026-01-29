import { useState, useEffect, useRef } from "react";
import { useSiteContent, useUpdateSiteContent, AboutContent, uploadImage } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Loader2, Save, Upload, Image } from "lucide-react";

const AboutEditor = () => {
  const { data: content, isLoading } = useSiteContent<AboutContent>("about");
  const updateContent = useUpdateSiteContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<AboutContent>({
    title: "",
    description: "",
    profileImage: "",
  });

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const path = `profile-${timestamp}.${file.name.split(".").pop()}`;
      const url = await uploadImage(file, path);
      setFormData({ ...formData, profileImage: url });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync({ section: "about", content: formData });
      toast.success("About section updated!");
    } catch (error) {
      toast.error("Failed to update about section");
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
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">About Section</h2>
        <p className="font-body text-sm text-muted-foreground">
          Edit your about section and profile image.
        </p>
      </div>

      <div className="grid gap-5">
        {/* Image Upload */}
        <div>
          <label className="font-body text-sm text-foreground block mb-2">Profile Image</label>
          <div className="flex items-start gap-4">
            <div className="w-32 h-32 rounded-xl bg-secondary/50 border border-border overflow-hidden flex items-center justify-center">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-secondary text-foreground font-body text-sm rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </>
                )}
              </button>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Recommended: Square image, max 5MB
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-foreground block mb-2">Section Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="e.g., About Me"
          />
        </div>

        <div>
          <label className="font-body text-sm text-foreground block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            placeholder="Tell visitors about yourself..."
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

export default AboutEditor;
