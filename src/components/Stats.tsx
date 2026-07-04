import ScrollReveal from "./ScrollReveal";
import { useEffect, useRef, useState } from "react";

const STATS = [
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

const Stat = ({ s }: { s: (typeof STATS)[number] }) => {
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

const Stats = () => (
  <section className="py-16 lg:py-20 border-y border-border/60">
    <div className="container mx-auto px-6">
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s) => (
            <Stat key={s.label} s={s} />
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default Stats;