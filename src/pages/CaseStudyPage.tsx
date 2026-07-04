import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Check, Clock, Target, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollReveal from "@/components/ScrollReveal";
import { getCaseStudy, caseStudies } from "@/data/caseStudies";

const CaseStudyPage = () => {
  const { slug = "" } = useParams();
  const study = getCaseStudy(slug);

  if (!study) return <Navigate to="/" replace />;

  const canonical = `https://harezalbaki.com/case-studies/${study.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${study.client} — ${study.tagline}`,
    description: study.problem,
    author: { "@type": "Person", name: "Md Harez Al Baki" },
    mainEntityOfPage: canonical,
  };

  const others = caseStudies.filter((c) => c.slug !== study.slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{`${study.client} Case Study — ${study.result} | Harez Al Baki`}</title>
        <meta name="description" content={study.tagline} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${study.client} — ${study.result}`} />
        <meta property="og:description" content={study.tagline} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <ScrollProgress />
      <Navigation />

      <main className="pt-24">
        <section className="py-16 lg:py-24 bg-secondary/40">
          <div className="container mx-auto px-6 max-w-5xl">
            <Link
              to="/#case-studies"
              className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All case studies
            </Link>
            <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              {study.industry}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">{study.client}</h1>
            <p className="font-body text-xl text-muted-foreground max-w-3xl">{study.tagline}</p>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {study.metrics.map((m) => (
                <div key={m.k} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <div className="font-display text-3xl md:text-4xl font-bold text-gradient">{m.v}</div>
                  <div className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{m.k}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 max-w-5xl grid lg:grid-cols-3 gap-10">
            <aside className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-body mb-1">
                  <Clock className="w-4 h-4" /> Timeline
                </div>
                <div className="font-display text-lg">{study.timeline}</div>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-body mb-3">
                  <Target className="w-4 h-4" /> Services
                </div>
                <ul className="space-y-2">
                  {study.services.map((s) => (
                    <li key={s} className="font-body text-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-primary text-sm font-body mb-1">
                  <TrendingUp className="w-4 h-4" /> Outcome
                </div>
                <div className="font-display text-lg">{study.result}</div>
              </div>
            </aside>

            <div className="lg:col-span-2 space-y-12">
              <ScrollReveal>
                <h2 className="font-display text-2xl md:text-3xl mb-4">The challenge</h2>
                <p className="font-body text-muted-foreground text-lg leading-relaxed">{study.problem}</p>
              </ScrollReveal>

              <ScrollReveal>
                <h2 className="font-display text-2xl md:text-3xl mb-4">The approach</h2>
                <ul className="space-y-3">
                  {study.approach.map((a) => (
                    <li key={a} className="flex gap-3 font-body text-muted-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal>
                <h2 className="font-display text-2xl md:text-3xl mb-6">Strategy pillars</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {study.strategy.map((s, i) => (
                    <div key={s.title} className="p-5 rounded-xl bg-card border border-border">
                      <div className="font-display text-xs text-primary mb-2">0{i + 1}</div>
                      <div className="font-display text-lg mb-2">{s.title}</div>
                      <p className="font-body text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {study.testimonial && (
                <ScrollReveal>
                  <blockquote className="p-8 rounded-2xl bg-gradient-crystal text-primary-foreground">
                    <p className="font-display text-xl leading-relaxed mb-4">"{study.testimonial.quote}"</p>
                    <footer className="font-body text-sm opacity-90">
                      — {study.testimonial.author}, {study.testimonial.role}
                    </footer>
                  </blockquote>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-secondary/40">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">Want results like this?</h2>
            <p className="font-body text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Book a free strategy call and get a tailored growth plan for your business.
            </p>
            <Link
              to="/#lead-magnet"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-crystal text-primary-foreground font-body font-semibold shadow-crystal hover:shadow-glow transition-all"
            >
              Book free strategy call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {others.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-6 max-w-5xl">
              <h2 className="font-display text-2xl md:text-3xl mb-8">More case studies</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {others.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/case-studies/${c.slug}`}
                    className="group p-6 rounded-2xl bg-card border border-border hover:shadow-crystal hover:-translate-y-1 transition-all"
                  >
                    <div className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">{c.industry}</div>
                    <div className="font-display text-lg mb-2">{c.client}</div>
                    <div className="font-body text-sm text-primary">{c.result} →</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

export default CaseStudyPage;