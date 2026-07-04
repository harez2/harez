import { useState } from "react";
import { Loader2, Plus, Save, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useAdminTestimonials,
  useUpsertRow,
  useDeleteRow,
  type Testimonial,
} from "@/hooks/useContent";

type Draft = Partial<Testimonial> & { quote: string; author: string };
const empty: Draft = { quote: "", author: "", role: "", rating: 5, display_order: 0, published: true };

const TestimonialsEditor = () => {
  const { data: rows, isLoading } = useAdminTestimonials();
  const upsert = useUpsertRow<Testimonial>("testimonials");
  const remove = useDeleteRow("testimonials");
  const [draft, setDraft] = useState<Draft>(empty);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.quote.trim() || !draft.author.trim()) {
      toast.error("Quote and author are required.");
      return;
    }
    try {
      await upsert.mutateAsync(draft as Testimonial);
      toast.success(draft.id ? "Updated." : "Added.");
      setDraft(empty);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl mb-1">Testimonials</h2>
        <p className="font-body text-sm text-muted-foreground">Client quotes shown on the homepage.</p>
      </div>

      <form onSubmit={save} className="p-5 rounded-xl border border-border bg-secondary/30 space-y-4">
        <div>
          <Label>Quote *</Label>
          <Textarea
            value={draft.quote}
            onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
            rows={3}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Author *</Label>
            <Input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
          </div>
          <div>
            <Label>Role / Company</Label>
            <Input value={draft.role ?? ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
          </div>
          <div>
            <Label>Rating (1–5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={draft.rating ?? 5}
              onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Display order</Label>
            <Input
              type="number"
              value={draft.display_order ?? 0}
              onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-body">
            <Switch
              checked={draft.published ?? true}
              onCheckedChange={(v) => setDraft({ ...draft, published: v })}
            />
            Published
          </label>
          <div className="flex gap-2">
            {draft.id && (
              <button
                type="button"
                onClick={() => setDraft(empty)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-body"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={upsert.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
            >
              {upsert.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : draft.id ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {draft.id ? "Save changes" : "Add testimonial"}
            </button>
          </div>
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
                    <div className="font-display">{r.author}</div>
                    {r.role && <div className="text-xs text-muted-foreground">— {r.role}</div>}
                    {!r.published && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted">Draft</span>}
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{r.quote}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setDraft(r)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this testimonial?")) remove.mutate(r.id);
                    }}
                    aria-label="Delete testimonial"
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

export default TestimonialsEditor;