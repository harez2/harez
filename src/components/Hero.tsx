import { ArrowRight, Sparkles, TrendingUp, Users, Target } from "lucide-react";
import { useSiteContent, HeroContent } from "@/hooks/useSiteContent";
import HeroBackground from "./HeroBackground";

const Hero = () => {
  const { data: content } = useSiteContent<HeroContent>("hero");
  const badge = content?.badge || "Performance Marketing Consultant & Growth Partner";

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <HeroBackground />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 opacity-0 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="font-body text-xs font-medium text-primary">{badge}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-6 opacity-0 animate-fade-up animation-delay-100">
              Scale your business with{" "}
              <span className="text-gradient">data-driven</span> performance marketing
            </h1>

            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 opacity-0 animate-fade-up animation-delay-200 leading-relaxed">
              I help businesses generate more qualified leads, increase online sales, and maximize ROI through Meta Ads, Google Ads, SEO and Conversion Rate Optimization.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 opacity-0 animate-fade-up animation-delay-300">
              <a
                href="#lead-magnet"
                className="group w-full sm:w-auto px-7 py-4 bg-gradient-crystal text-primary-foreground font-body font-semibold rounded-xl shadow-crystal hover:shadow-glow transition-all flex items-center justify-center gap-2"
              >
                Book Free Strategy Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#case-studies"
                className="w-full sm:w-auto px-7 py-4 bg-card border border-border text-foreground font-body font-medium rounded-xl shadow-soft hover:border-primary/50 transition-all"
              >
                View Case Studies
              </a>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 opacity-0 animate-fade-up animation-delay-400">
              <TrustMini n="$500K+" l="Ad spend" />
              <span className="w-px h-8 bg-border" />
              <TrustMini n="30+" l="Businesses" />
              <span className="w-px h-8 bg-border" />
              <TrustMini n="300%" l="Avg ROAS" />
            </div>
          </div>

          {/* Right: Floating dashboard mockup */}
          <div className="relative hidden lg:block opacity-0 animate-fade-up animation-delay-300">
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustMini = ({ n, l }: { n: string; l: string }) => (
  <div>
    <div className="font-display text-xl font-extrabold">{n}</div>
    <div className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{l}</div>
  </div>
);

const DashboardMock = () => (
  <div className="relative">
    <div className="absolute -top-6 -right-4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-6 -left-4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

    {/* Main card */}
    <div className="relative rounded-3xl bg-card border border-border shadow-crystal p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-body text-xs text-muted-foreground">Campaign Performance</div>
          <div className="font-display text-lg font-bold">Last 30 days</div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <TrendingUp className="w-3 h-3" /> +42.3%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <MetricTile icon={Users} label="Leads" value="1,284" trend="+18%" />
        <MetricTile icon={Target} label="ROAS" value="4.6x" trend="+22%" />
      </div>

      {/* Fake chart */}
      <div className="h-28 flex items-end gap-1.5">
        {[40, 55, 45, 70, 62, 78, 65, 85, 72, 90, 82, 95].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-primary/50 to-primary"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>

    {/* Floating chip */}
    <div className="absolute -top-4 -left-4 rounded-2xl bg-card border border-border shadow-crystal px-4 py-3 animate-float">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Conversions</div>
          <div className="font-display text-sm font-bold">↑ 312%</div>
        </div>
      </div>
    </div>

    <div className="absolute -bottom-4 -right-4 rounded-2xl bg-card border border-border shadow-crystal px-4 py-3 animate-float animation-delay-400">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Target className="w-4 h-4 text-accent" />
        </div>
        <div>
          <div className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">CPL</div>
          <div className="font-display text-sm font-bold">$4.20</div>
        </div>
      </div>
    </div>
  </div>
);

const MetricTile = ({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
}) => (
  <div className="p-3 rounded-xl bg-secondary/60 border border-border">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span className="font-body text-[11px] text-muted-foreground">{label}</span>
    </div>
    <div className="font-display text-lg font-bold">{value}</div>
    <div className="font-body text-[11px] text-primary">{trend}</div>
  </div>
);

export default Hero;
