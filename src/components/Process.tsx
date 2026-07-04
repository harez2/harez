import { Microscope, Compass, Rocket, Gauge, TrendingUp } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const STEPS = [
  { icon: Microscope, title: "Research", desc: "Deep dive into your business, audience and competitors." },
  { icon: Compass, title: "Strategy", desc: "A written game plan mapped to your revenue goals." },
  { icon: Rocket, title: "Launch", desc: "Campaigns, creative and tracking shipped with intent." },
  { icon: Gauge, title: "Optimize", desc: "Continuous testing to lower CAC and raise ROAS." },
  { icon: TrendingUp, title: "Scale", desc: "Systematic scaling once the economics hold up." },
];

const Process = () => (
  <section id="process" className="py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            The Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            A repeatable path from{" "}
            <span className="text-gradient">insight to scale</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            No guesswork. Every engagement follows the same five-step system.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative">
        <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 80}>
              <div className="relative text-center px-2">
                <div className="relative mx-auto w-14 h-14 rounded-2xl bg-card border border-border shadow-crystal flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-crystal text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg mb-1.5">{s.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Process;