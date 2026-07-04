import { useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useAdminCaseStudies,
  useUpsertRow,
  useDeleteRow,
  type CaseStudy,
} from "@/hooks/useContent";

type Draft = Partial<CaseStudy> & {
  slug: string;
  client: string;
  industry: string;
  tagline: string;
  problem: string;
  result: string;
};

const empty: Draft = {
  slug: "",
  client: "",
  industry: "",
  tagline: "",
  problem: "",
  result: "",
  timeline: "",
  approach: [],
  strategy: [],
  metrics: [],
  services: [],
  testimonial: null,
  display_order: 0,
  published: true,
};

const CaseStudiesEditor = () => {
  const { data: rows, isLoading } = useAdminCaseStudies();
  const upsert = useUpsertRow<CaseStudy>("case_studies");
  const remove = useDeleteRow("case_studies");
  const [draft, setDraft] = useState<Draft>(empty);
  const [approachText, setApproachText] = useState("");
  const [servicesText, setServicesText] = useState("");
  const [metricsText, setMetricsText] = useState("");
  const [strategyText, setStrategyText] = useState("");
  const [testimonialText, setTestimonialText] = useState("");

  const edit = (r: CaseStudy) => {
    setDraft(r);
    setApproachText(r.approach.join("\n"));
    setServicesText(r.services.join(", "));
    setMetricsText(r.metrics.map((m) => `${m.k}: ${m.v}`).join("\n"));
    setStrategyText(r.strategy.map((s) => `${s.title}: ${s.description}`).join("\n"));
    setTestimonialText(r.testimonial ? JSON.stringify(r.testimonial, null, 2) : "");
  };

  const reset = () => {
    setDraft(empty);
    setApproachText("");
    setServicesText("");
    setMetricsText("");
    setStrategyText("");
    setTestimonialText("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.slug.trim() || !draft.client.trim() || !draft.result.trim()) {
      toast.error("Slug, client and result are required.");
      return;
    }
    const approach = approachText.split("\n").map((s) => s.trim()).filter(Boolean);
    const services = servicesText.split(",").map((s) => s.trim()).filter(Boolean);
    const metrics = metricsText
      .split("\n")
      .map((line) => {
        const [k, ...rest] = line.split(":");
        return k && rest.length ? { k: k.trim(), v: rest.join(":").trim() } : null;
      })
      .filter((m): m is { k: string; v: string } => !!m);
    const strategy = strategyText
      .split("\n")
      .map((line) => {
        const [title, ...rest] = line.split(":");
        return title && rest.length ? { title: title.trim(), description: rest.join(":").trim() } : null;
      })
      .filter((s): s is { title: string; description: string } => !!s);
    let testimonial: CaseStudy["testimonial"] = null;
    if (testimonialText.trim()) {
      try {
        testimonial = JSON.parse(testimonialText);
      } catch {
        toast.error('Testimonial must be JSON like {"quote":"...","author":"...","role":"..."}');
        return;
      }
    }
    try {
      await upsert.mutateAsync({
        ...(draft as CaseStudy),
        approach,
        services,
        metrics,
        strategy,
        testimonial,
      });
      toast.success(draft.id ? "Updated." : "Added.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl mb-1">Case Studies</h2>
        <p className="font-body text-sm text-muted-foreground">
          Detail pages rendered at <code>/case-studies/&lt;slug&gt;</code>.
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
            <Label>Client *</Label>
            <Input value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} />
          </div>
          <div>
            <Label>Industry</Label>
            <Input value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} />
          </div>
          <div>
            <Label>Timeline</Label>
            <Input value={draft.timeline ?? ""} onChange={(e) => setDraft({ ...draft, timeline: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Tagline</Label>
          <Input value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
        </div>
        <div>
          <Label>Result headline *</Label>
          <Input value={draft.result} onChange={(e) => setDraft({ ...draft, result: e.target.value })} />
        </div>
        <div>
          <Label>Problem</Label>
          <Textarea rows={3} value={draft.problem} onChange={(e) => setDraft({ ...draft, problem: e.target.value })} />
        </div>
        <div>
          <Label>Approach (one bullet per line)</Label>
          <Textarea rows={4} value={approachText} onChange={(e) => setApproachText(e.target.value)} />
        </div>
        <div>
          <Label>Services (comma-separated)</Label>
          <Input value={servicesText} onChange={(e) => setServicesText(e.target.value)} />
        </div>
        <div>
          <Label>Metrics (one per line, format: "Label: Value")</Label>
          <Textarea rows={3} value={metricsText} onChange={(e) => setMetricsText(e.target.value)} placeholder="ROAS: 4.2x" />
        </div>
        <div>
          <Label>Strategy (one per line, format: "Title: Description")</Label>
          <Textarea rows={4} value={strategyText} onChange={(e) => setStrategyText(e.target.value)} />
        </div>
        <div>
          <Label>Testimonial (JSON, optional)</Label>
          <Textarea
            rows={3}
            value={testimonialText}
            onChange={(e) => setTestimonialText(e.target.value)}
            placeholder='{"quote":"…","author":"…","role":"…"}'
          />
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
            {draft.id ? "Save changes" : "Add case study"}
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
                    <div className="font-display">{r.client}</div>
                    <div className="text-xs text-muted-foreground">— {r.industry}</div>
                    {!r.published && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted">Draft</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">/case-studies/{r.slug}</div>
                  <p className="text-sm text-primary">{r.result}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => edit(r)} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this case study?")) remove.mutate(r.id);
                    }}
                    aria-label="Delete case study"
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

export default CaseStudiesEditor;