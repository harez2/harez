import { Quote, Star } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const TESTIMONIALS = [
  {
    quote:
      "Harez turned our ad account from a cost center into our biggest growth channel. Every dollar is now accountable — and our ROAS 4x'd in one quarter.",
    author: "Ayesha R.",
    role: "Founder, Tahoor Studio",
  },
  {
    quote:
      "We finally have a predictable pipeline. Sales knows exactly how many qualified conversations they'll get each week thanks to Harez's system.",
    author: "Rakib H.",
    role: "Head of Growth, Completo",
  },
  {
    quote:
      "Strategic, sharp, and hands-on. Harez doesn't just run ads — he thinks like an owner and treats the P&L like his own.",
    author: "Nusrat J.",
    role: "Marketing Director, Light of Hope",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl mb-3">
            What clients <span className="text-gradient">say</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Founders and marketing leaders who scaled with a real growth partner.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <ScrollReveal key={t.author} delay={i * 80}>
            <figure className="h-full p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-crystal transition-all">
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <div className="flex gap-1 mb-4" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="font-body text-muted-foreground leading-relaxed mb-6">
                "{t.quote}"
              </blockquote>
              <figcaption>
                <div className="font-display text-base">{t.author}</div>
                <div className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  {t.role}
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;