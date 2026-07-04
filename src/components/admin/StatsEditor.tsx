import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import type { StatItem } from "@/components/Stats";

const DEFAULTS: StatItem[] = [
  { value: 500, suffix: "K+", prefix: "$", label: "Managed Ad Spend" },
  { value: 30, suffix: "+", label: "Businesses Served" },
  { value: 300, suffix: "%", label: "Average ROAS" },
  { value: 6, suffix: "+", label: "Years Experience" },
];

const StatsEditor = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site_content", "stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "stats")
        .maybeSingle();
      if (error) throw error;
      return (data?.content as { items?: StatItem[] } | null) ?? null;
    },
  });

  const [items, setItems] = useState<StatItem[]>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.items && data.items.length > 0) setItems(data.items);
  }, [data]);

  const update = (i: number, patch: Partial<StatItem>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const add = () =>
    setItems((prev) => [...prev, { value: 0, prefix: "", suffix: "+", label: "New stat" }]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({ section: "stats", content: { items } as any }, { onConflict: "section" });
      if (error) throw error;
      toast.success("Stats updated!");
      qc.invalidateQueries({ queryKey: ["site_content", "stats"] });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save stats");
    } finally {
      setSaving(false);
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
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Stats Section</h2>
        <p className="font-body text-sm text-muted-foreground">
          Edit the animated counter stats shown below the hero.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[80px_120px_80px_1fr_auto] gap-3 items-center p-4 bg-secondary/30 border border-border rounded-xl"
          >
            <input
              type="text"
              value={s.prefix ?? ""}
              onChange={(e) => update(i, { prefix: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
              placeholder="Prefix ($)"
            />
            <input
              type="number"
              value={s.value}
              onChange={(e) => update(i, { value: Number(e.target.value) || 0 })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
              placeholder="Value"
            />
            <input
              type="text"
              value={s.suffix ?? ""}
              onChange={(e) => update(i, { suffix: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
              placeholder="Suffix (K+)"
            />
            <input
              type="text"
              value={s.label}
              onChange={(e) => update(i, { label: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
              placeholder="Label"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove stat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 bg-secondary/60 border border-border rounded-xl font-body text-sm text-foreground hover:bg-secondary transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add stat
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-xl shadow-crystal hover:shadow-glow transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StatsEditor;