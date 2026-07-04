import { useState } from "react";
import { Loader2, Plus, Save, Trash2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import {
  useAdminResources,
  useUpsertRow,
  useDeleteRow,
  type Resource,
} from "@/hooks/useContent";

type Draft = Partial<Resource> & { slug: string; title: string; description: string; bullets: string[] };
const empty: Draft = {
  slug: "",
  title: "",
  description: "",
  bullets: [],
  badge: "PDF",
  file_path: "",
  display_order: 0,
  published: true,
};

const ResourcesEditor = () => {
  const { data: rows, isLoading } = useAdminResources();
  const upsert = useUpsertRow<Resource>("resources");
  const remove = useDeleteRow("resources");
  const [draft, setDraft] = useState<Draft>(empty);
  const [bulletsText, setBulletsText] = useState("");
  const [uploading, setUploading] = useState(false);

  const editRow = (r: Resource) => {
    setDraft(r);
    setBulletsText(r.bullets.join("\n"));
  };

  const reset = () => {
    setDraft(empty);
    setBulletsText("");
  };

  const handleUpload = async (file: File) => {
    const slug = draft.slug || file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const path = `${slug}-${Date.now()}-${file.name}`;
    setUploading(true);
    try {
      const { error } = await supabase.storage.from("resources").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      setDraft({ ...draft, file_path: path });
      toast.success("File uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.slug.trim() || !draft.title.trim() || !draft.description.trim()) {
      toast.error("Slug, title and description are required.");
      return;
    }
    const bullets = bulletsText.split("\n").map((s) => s.trim()).filter(Boolean);
    try {
      await upsert.mutateAsync({ ...(draft as Resource), bullets });
      toast.success(draft.id ? "Updated." : "Added.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl mb-1">Resources</h2>
        <p className="font-body text-sm text-muted-foreground">
          Downloadable playbooks. PDFs are stored privately — visitors get a temporary signed link after submitting the form.
        </p>
      </div>

      <form onSubmit={save} className="p-5 rounded-xl border border-border bg-secondary/30 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Slug *</Label>
            <Input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
            />
          </div>
          <div>
            <Label>Badge</Label>
            <Input value={draft.badge ?? ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Title *</Label>
          <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </div>
        <div>
          <Label>Description *</Label>
          <Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </div>
        <div>
          <Label>Bullets (one per line)</Label>
          <Textarea rows={3} value={bulletsText} onChange={(e) => setBulletsText(e.target.value)} />
        </div>
        <div>
          <Label>PDF file</Label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm cursor-pointer hover:bg-secondary">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading…" : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
            {draft.file_path && (
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5" /> {draft.file_path}
              </span>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Display order</Label>
            <Input
              type="number"
              value={draft.display_order ?? 0}
              onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-end gap-2 text-sm font-body pb-1">
            <Switch
              checked={draft.published ?? true}
              onCheckedChange={(v) => setDraft({ ...draft, published: v })}
            />
            Published
          </label>
        </div>
        <div className="flex justify-end gap-2">
          {draft.id && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg border border-border text-sm">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={upsert.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
          >
            {upsert.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : draft.id ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {draft.id ? "Save changes" : "Add resource"}
          </button>
        </div>
      </form>

      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
      ) : (
        <div className="space-y-3">
          {rows?.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-display">{r.title}</div>
                    {!r.published && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted">Draft</span>}
                    {!r.file_path && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">No file</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">/{r.slug}</div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => editRow(r)} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this resource?")) remove.mutate(r.id);
                    }}
                    aria-label="Delete resource"
                    className="w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesEditor;