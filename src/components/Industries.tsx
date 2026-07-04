import { Shirt, GraduationCap, Stethoscope, Code2, Home, UtensilsCrossed, HardHat, HeartHandshake, Briefcase, ShoppingCart } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const ITEMS = [
  { icon: Shirt, label: "Fashion" },
  { icon: GraduationCap, label: "Education" },
  { icon: Stethoscope, label: "Healthcare" },
  { icon: Code2, label: "Software" },
  { icon: Home, label: "Real Estate" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: HardHat, label: "Construction" },
  { icon: HeartHandshake, label: "NGO" },
  { icon: Briefcase, label: "Professional Services" },
  { icon: ShoppingCart, label: "E-commerce" },
];

const Industries = () => (
  <section id="industries" className="py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            Industries
          </span>
          <h2 className="font-display text-4xl md:text-5xl mb-3">
            Experience across{" "}
            <span className="text-gradient">10+ industries</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            The playbook adapts. The rigor doesn't.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {ITEMS.map((it, i) => (
          <ScrollReveal key={it.label} delay={i * 30}>
            <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-crystal hover:border-primary/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <it.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="font-body text-sm font-medium text-center">{it.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default Industries;