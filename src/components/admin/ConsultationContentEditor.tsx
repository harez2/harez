import { useState } from "react";
import { useConsultationContent, useUpdateConsultationContent } from "@/hooks/useConsultation";
import { toast } from "sonner";
import { Loader2, Save, Plus, X } from "lucide-react";

const ConsultationContentEditor = () => {
  const { data: heroContent, isLoading: heroLoading } = useConsultationContent("hero");
  const { data: videoContent, isLoading: videoLoading } = useConsultationContent("video");
  const { data: benefitsContent, isLoading: benefitsLoading } = useConsultationContent("benefits");
  const { data: paymentContent, isLoading: paymentLoading } = useConsultationContent("payment");
  const updateContent = useUpdateConsultationContent();

  const [hero, setHero] = useState<Record<string, any>>({});
  const [video, setVideo] = useState<Record<string, any>>({});
  const [benefits, setBenefits] = useState<Record<string, any>>({});
  const [payment, setPayment] = useState<Record<string, any>>({});
  const [initialized, setInitialized] = useState(false);

  if (heroLoading || videoLoading || benefitsLoading || paymentLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (!initialized) {
    setHero(heroContent?.content || {});
    setVideo(videoContent?.content || {});
    setBenefits(benefitsContent?.content || { items: [] });
    setPayment(paymentContent?.content || {});
    setInitialized(true);
  }

  const saveSection = async (section: string, content: Record<string, any>) => {
    try {
      await updateContent.mutateAsync({ section, content });
      toast.success(`${section} content saved!`);
    } catch {
      toast.error("Failed to save");
    }
  };

  const benefitItems = benefits.items || [];

  const addBenefit = () => {
    setBenefits({ ...benefits, items: [...benefitItems, { icon: "CheckCircle", title: "", description: "" }] });
  };

  const updateBenefit = (index: number, field: string, value: string) => {
    const updated = [...benefitItems];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits({ ...benefits, items: updated });
  };

  const removeBenefit = (index: number) => {
    setBenefits({ ...benefits, items: benefitItems.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Hero / Bio Section</h3>
          <button onClick={() => saveSection("hero", hero)} disabled={updateContent.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
            {updateContent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
        <input type="text" value={hero.subtitle || ""} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          placeholder="Subtitle (e.g., 1:1 Business Growth Consultation)" />
        <input type="text" value={hero.headline || ""} onChange={(e) => setHero({ ...hero, headline: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          placeholder="Headline" />
        <textarea value={hero.bio || ""} onChange={(e) => setHero({ ...hero, bio: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          placeholder="Bio text" rows={4} />
      </div>

      <hr className="border-border" />

      {/* Video Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Video Section</h3>
          <button onClick={() => saveSection("video", video)} disabled={updateContent.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
        <input type="text" value={video.title || ""} onChange={(e) => setVideo({ ...video, title: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          placeholder="Video section title" />
        <input type="url" value={video.video_url || ""} onChange={(e) => setVideo({ ...video, video_url: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          placeholder="YouTube or Vimeo URL" />
        <textarea value={video.description || ""} onChange={(e) => setVideo({ ...video, description: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          placeholder="Video description" rows={2} />
      </div>

      <hr className="border-border" />

      {/* Benefits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Benefits</h3>
          <div className="flex gap-2">
            <button onClick={addBenefit} className="px-3 py-2 bg-secondary text-foreground font-body text-sm rounded-lg flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
            <button onClick={() => saveSection("benefits", benefits)} disabled={updateContent.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
        <input type="text" value={benefits.title || ""} onChange={(e) => setBenefits({ ...benefits, title: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          placeholder="Benefits section title" />
        {benefitItems.map((item: any, index: number) => (
          <div key={index} className="flex gap-2 items-start bg-secondary/30 p-3 rounded-lg">
            <div className="flex-1 space-y-2">
              <input type="text" value={item.title} onChange={(e) => updateBenefit(index, "title", e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Benefit title" />
              <input type="text" value={item.description} onChange={(e) => updateBenefit(index, "description", e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Benefit description" />
            </div>
            <button onClick={() => removeBenefit(index)} className="text-muted-foreground hover:text-destructive mt-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <hr className="border-border" />

      {/* Payment Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Payment Settings</h3>
          <button onClick={() => saveSection("payment", payment)} disabled={updateContent.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
        <input type="number" value={payment.amount || ""} onChange={(e) => setPayment({ ...payment, amount: Number(e.target.value) })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          placeholder="Session fee (BDT)" />
        <input type="text" value={payment.bkash_number || ""} onChange={(e) => setPayment({ ...payment, bkash_number: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          placeholder="bKash Number" />
        <textarea value={payment.bank_details || ""} onChange={(e) => setPayment({ ...payment, bank_details: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          placeholder="Bank Transfer Details (Account Name, Number, Bank, Branch, Routing)" rows={4} />
      </div>
    </div>
  );
};

export default ConsultationContentEditor;
