import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const CASES = [
  {
    slug: "tahoor-studio",
    client: "Tahoor Studio",
    industry: "Fashion",
    problem: "High CPL, low return on ad spend across Meta.",
    result: "4.2x ROAS in 90 days",
    metrics: [
      { k: "ROAS", v: "4.2x" },
      { k: "CPL", v: "-62%" },
      { k: "Revenue", v: "+310%" },
    ],
  },
  {
    slug: "completo",
    client: "Completo",
    industry: "Software",
    problem: "Needed qualified B2B leads at predictable cost.",
    result: "112 SQLs / month at $18 CPL",
    metrics: [
      { k: "SQLs", v: "112/mo" },
      { k: "CPL", v: "$18" },
      { k: "Pipeline", v: "$240K" },
    ],
  },
  {
    slug: "light-of-hope",
    client: "Light of Hope",
    industry: "Non-profit",
    problem: "Scaling awareness and donations on a tight budget.",
    result: "2.8x donations, halved cost per donor",
    metrics: [
      { k: "Donations", v: "2.8x" },
      { k: "CPA", v: "-51%" },
      { k: "Reach", v: "1.2M" },
    ],
  },
  {
    slug: "chhayatoru",
    client: "Chhayatoru",
    industry: "Education",
    problem: "Course launch with limited historical data.",
    result: "Sold-out first cohort in 3 weeks",
    metrics: [
      { k: "Enrollments", v: "142" },
      { k: "ROAS", v: "5.6x" },
      { k: "CAC", v: "$11" },
    ],
  },
];

const CaseStudies = () => (
  <section id="case-studies" className="py-24 lg:py-32 bg-secondary/40">
    <div className="container mx-auto px-6">
      <ScrollReveal>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              Case Studies
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-3">
              Results that <span className="text-gradient">compounded</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              A few examples of what happens when strategy, creative and tracking are aligned.
            </p>
          </div>
          <a
            href="#lead-magnet"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:gap-3 transition-all"
          >
            Request a case study PDF <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-6">
        {CASES.map((c, i) => (
          <ScrollReveal key={c.client} delay={i * 60}>
            <Link
              to={`/case-studies/${c.slug}`}
              className="block group relative h-full p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-crystal hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="font-display text-xl">{c.client}</div>
                  <div className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    {c.industry}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-5 leading-relaxed">
                <span className="text-foreground font-medium">Challenge:</span> {c.problem}
              </p>
              <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="font-display text-base text-primary">{c.result}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {c.metrics.map((m) => (
                  <div key={m.k} className="text-center p-3 rounded-lg bg-secondary/60">
                    <div className="font-display text-lg font-bold">{m.v}</div>
                    <div className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">
                      {m.k}
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default CaseStudies;