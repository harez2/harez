import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, Star, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SERVICES, SERVICE_LIST } from "@/data/services";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? SERVICES[slug] : undefined;
  if (!service) return <Navigate to="/404" replace />;

  const Icon = service.icon;

  return (
    <>
      <Helmet>
        <title>{service.metaTitle}</title>
        <meta name="description" content={service.metaDescription} />
        <link rel="canonical" href={`https://harezalbaki.com/services/${service.slug}`} />
        <meta property="og:title" content={service.metaTitle} />
        <meta property="og:description" content={service.metaDescription} />
        <meta property="og:url" content={`https://harezalbaki.com/services/${service.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <ScrollProgress />
      <Navigation />

      <main className="overflow-hidden">
        {/* Hero */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] crystal-orb opacity-30 pointer-events-none" />
          <div className="container mx-auto px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
                  <Icon className="w-3.5 h-3.5" />
                  {service.eyebrow}
                </div>
                <h1 className="font-display text-4xl md:text-6xl mb-6 leading-[1.05]">
                  {service.title} <span className="text-gradient">{service.titleHighlight}</span>
                </h1>
                <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                  {service.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/#lead-magnet"
                    className="group inline-flex items-center gap-2 px-7 py-4 bg-gradient-crystal text-primary-foreground font-body font-semibold rounded-xl shadow-crystal hover:shadow-glow transition-all"
                  >
                    Book Free Strategy Call
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/#case-studies"
                    className="px-7 py-4 bg-card border border-border font-body font-medium rounded-xl shadow-soft hover:border-primary/50 transition-all"
                  >
                    See results
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 lg:py-24 bg-secondary/40">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="font-display text-3xl md:text-4xl mb-3">
                  Why clients <span className="text-gradient">choose this</span>
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {service.benefits.map((b, i) => (
                <ScrollReveal key={b.title} delay={i * 60}>
                  <div className="h-full p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-crystal hover:border-primary/40 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="font-display text-lg mb-1.5">{b.title}</div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="font-display text-3xl md:text-4xl mb-3">
                  The <span className="text-gradient">process</span>
                </h2>
                <p className="font-body text-muted-foreground text-lg">A repeatable path from audit to scale.</p>
              </div>
            </ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-4">
              {service.process.map((p, i) => (
                <ScrollReveal key={p.step} delay={i * 60}>
                  <div className="flex gap-5 p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-crystal hover:border-primary/30 transition-all">
                    <div className="font-display text-2xl font-extrabold text-gradient min-w-[3rem]">
                      {p.step}
                    </div>
                    <div>
                      <div className="font-display text-lg mb-1">{p.title}</div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="py-20 lg:py-24 bg-secondary/40">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
              <ScrollReveal>
                <h2 className="font-display text-3xl md:text-4xl mb-4">
                  What you <span className="text-gradient">get</span>
                </h2>
                <p className="font-body text-muted-foreground text-lg leading-relaxed">
                  Every engagement includes these deliverables — nothing hidden, nothing vague.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <ul className="space-y-3">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-body text-sm">{d}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="font-display text-3xl md:text-4xl mb-3">
                  Simple, <span className="text-gradient">transparent pricing</span>
                </h2>
                <p className="font-body text-muted-foreground text-lg">
                  Month-to-month. Cancel with 30 days' notice.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {service.pricing.map((tier, i) => (
                <ScrollReveal key={tier.name} delay={i * 60}>
                  <div
                    className={`relative h-full p-7 rounded-2xl border transition-all ${
                      tier.highlighted
                        ? "bg-gradient-to-b from-primary/5 to-transparent border-primary/50 shadow-crystal"
                        : "bg-card border-border shadow-soft hover:shadow-crystal hover:border-primary/30"
                    }`}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-crystal text-primary-foreground text-[11px] font-semibold">
                        Most Popular
                      </div>
                    )}
                    <div className="font-display text-lg mb-1">{tier.name}</div>
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="font-display text-3xl font-extrabold">{tier.price}</span>
                      {tier.period && (
                        <span className="font-body text-sm text-muted-foreground">{tier.period}</span>
                      )}
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 font-body text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/#lead-magnet"
                      className={`w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-body text-sm font-semibold transition-all ${
                        tier.highlighted
                          ? "bg-gradient-crystal text-primary-foreground shadow-crystal hover:shadow-glow"
                          : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      Get started
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 lg:py-24 bg-secondary/40">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center p-10 lg:p-14 rounded-3xl bg-card border border-border shadow-crystal">
                <div className="flex items-center justify-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="font-display text-xl md:text-2xl leading-snug mb-6">
                  "{service.testimonial.quote}"
                </blockquote>
                <div className="font-body text-sm">
                  <span className="font-semibold">{service.testimonial.name}</span>
                  <span className="text-muted-foreground"> · {service.testimonial.role}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-display text-3xl md:text-4xl mb-3">
                  Frequently <span className="text-gradient">asked</span>
                </h2>
              </div>
            </ScrollReveal>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {service.faq.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="rounded-2xl border border-border bg-card px-5 shadow-soft"
                  >
                    <AccordionTrigger className="font-display text-base text-left hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="relative max-w-4xl mx-auto p-10 lg:p-16 rounded-3xl bg-gradient-crystal text-primary-foreground text-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-grid" />
              <div className="relative">
                <h2 className="font-display text-3xl md:text-5xl mb-4 leading-tight">
                  Ready to scale {service.eyebrow.toLowerCase()}?
                </h2>
                <p className="font-body text-lg opacity-90 mb-8 max-w-xl mx-auto">
                  Book a free 30-minute strategy call. We'll diagnose the biggest lever in your funnel — no pitch.
                </p>
                <Link
                  to="/#lead-magnet"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground font-body font-semibold rounded-xl shadow-crystal hover:shadow-glow transition-all"
                >
                  Book Free Strategy Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Other services */}
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <div className="font-body text-xs text-muted-foreground uppercase tracking-wider">Explore other services</div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {SERVICE_LIST.filter((s) => s.slug !== service.slug).map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border font-body text-sm hover:border-primary/40 hover:shadow-soft transition-all"
                >
                  <s.icon className="w-4 h-4 text-primary" />
                  {s.eyebrow}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>

      <FloatingWhatsApp />
    </>
  );
};

export default ServicePage;