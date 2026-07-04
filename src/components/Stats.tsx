import ScrollReveal from "./ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const DEFAULT_STATS: StatItem[] = [
  { value: 500, suffix: "K+", prefix: "$", label: "Managed Ad Spend" },
  { value: 30, suffix: "+", label: "Businesses Served" },
  { value: 300, suffix: "%", label: "Average ROAS" },
  { value: 6, suffix: "+", label: "Years Experience" },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
}

const Stat = ({ s }: { s: StatItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(true),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const n = useCountUp(s.value, active);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-extrabold text-gradient">
        {s.prefix}
        {n}
        {s.suffix}
      </div>
      <div className="mt-2 font-body text-sm text-muted-foreground">{s.label}</div>
    </div>
  );
};

const Stats = () => {
  const { data } = useQuery({
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

  const stats =
    data?.items && Array.isArray(data.items) && data.items.length > 0
      ? data.items
      : DEFAULT_STATS;

  return (
    <section className="py-16 lg:py-20 border-y border-border/60">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <Stat key={`${s.label}-${i}`} s={s} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Stats;