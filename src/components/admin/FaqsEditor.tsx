import { useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAdminFaqs, useUpsertRow, useDeleteRow, type Faq } from "@/hooks/useContent";

type Draft = Partial<Faq> & { question: string; answer: string };
const empty: Draft = { question: "", answer: "", display_order: 0, published: true };

const FaqsEditor = () => {
  const { data: rows, isLoading } = useAdminFaqs();
  const upsert = useUpsertRow<Faq>("faqs");
  const remove = useDeleteRow("faqs");
  const [draft, setDraft] = useState<Draft>(empty);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.question.trim() || !draft.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    try {
      await upsert.mutateAsync(draft as Faq);
      toast.success(draft.id ? "Updated." : "Added.");
      setDraft(empty);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl mb-1">FAQs</h2>
        <p className="font-body text-sm text-muted-foreground">Frequently asked questions on the homepage.</p>
      </div>

      <form onSubmit={save} className="p-5 rounded-xl border border-border bg-secondary/30 space-y-4">
        <div>
          <Label>Question *</Label>
          <Input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
        </div>
        <div>
          <Label>Answer *</Label>
          <Textarea rows={4} value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
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
            {draft.id ? "Save changes" : "Add FAQ"}
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
                  <div className="font-display mb-1 flex items-center gap-2">
                    {r.question}
                    {!r.published && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted">Draft</span>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.answer}</p>
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
                      if (confirm("Delete this FAQ?")) remove.mutate(r.id);
                    }}
                    aria-label="Delete FAQ"
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

export default FaqsEditor;