import { Target, Search, TrendingUp, MousePointerClick, Compass, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const SERVICES = [
  {
    icon: Target, slug: "meta-ads", title: "Meta Ads Management",
    overview: "Full-funnel Facebook & Instagram ad campaigns engineered for measurable ROAS.",
    deliverables: ["Account audit", "Creative testing", "Custom audiences", "Weekly reporting"],
  },
  {
    icon: Search, slug: "google-ads", title: "Google Ads",
    overview: "Search, Performance Max, and YouTube campaigns tuned for qualified traffic.",
    deliverables: ["Keyword strategy", "Bid optimization", "Ad copy testing", "Conversion tracking"],
  },
  {
    icon: TrendingUp, slug: "seo", title: "SEO",
    overview: "Technical + content SEO that compounds — built for long-term organic growth.",
    deliverables: ["Technical audit", "On-page SEO", "Content strategy", "Link building"],
  },
  {
    icon: MousePointerClick, slug: "cro", title: "Conversion Rate Optimization",
    overview: "Turn more of your existing traffic into leads and revenue.",
    deliverables: ["Heatmap analysis", "A/B testing", "Landing page design", "Funnel review"],
  },
  {
    icon: Compass, slug: "marketing-consulting", title: "Marketing Consulting",
    overview: "Positioning, ICP, and channel roadmap tailored to your business goals.",
    deliverables: ["ICP definition", "Channel mix", "12-month roadmap", "KPI framework"],
  },
  {
    icon: BarChart3, slug: null, title: "Analytics & Tracking",
    overview: "GA4, GTM, and Meta CAPI setups you can actually trust for decisions.",
    deliverables: ["GA4 setup", "GTM implementation", "Conversion API", "Dashboards"],
  },
] as const;

const Services = () => (
  <section id="services" className="py-24 lg:py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-frost opacity-40 pointer-events-none" />
    <div className="container mx-auto px-6 relative">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            Growth services built for{" "}
            <span className="text-gradient">measurable outcomes</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Every engagement is designed around a single question: what will move your revenue this quarter?
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 60}>
            <div className="group relative h-full p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-crystal hover:border-primary/40 transition-all duration-300">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="font-body text-sm text-muted-foreground mb-5 leading-relaxed">
                {s.overview}
              </p>
              <ul className="space-y-2 mb-6">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 font-body text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
              {s.slug ? (
                <Link
                  to={`/services/${s.slug}`}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:gap-2.5 transition-all"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <a
                  href="#lead-magnet"
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:gap-2.5 transition-all"
                >
                  Get a proposal <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default Services;