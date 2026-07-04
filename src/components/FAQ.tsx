import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "./ScrollReveal";

const FAQS = [
  {
    q: "How is working with you different from hiring an agency?",
    a: "You work directly with me — no account managers, no juniors running your budget. Every strategy, creative brief and optimization decision is mine. It's the accountability of an in-house lead with the speed of a specialist.",
  },
  {
    q: "What kind of businesses do you work with?",
    a: "Ambitious e-commerce brands, B2B SaaS, education, and service businesses spending $3K–$100K/month on paid media. If you have product-market fit and want a real growth partner (not just a button pusher), we're a fit.",
  },
  {
    q: "How long before I see results?",
    a: "Most clients see meaningful improvements in CPL and ROAS within 30–60 days. Real compounding results — the kind that change your business — usually show up in months 3–6 once tracking, creative systems and funnel optimization are all working together.",
  },
  {
    q: "What's included in the free strategy call?",
    a: "A 30-minute working session where I audit your current setup (ads, tracking, funnel), identify the biggest bottleneck and give you a clear action plan — whether or not we end up working together.",
  },
  {
    q: "Do you require a long-term contract?",
    a: "No. Engagements are month-to-month after an initial 90-day sprint so we have enough runway to build, test and prove results. You stay because the numbers work — not because a contract locks you in.",
  },
  {
    q: "What tools and channels do you cover?",
    a: "Meta Ads, Google Ads (Search, Performance Max, YouTube), SEO, CRO and analytics (GA4, GTM, Meta CAPI, Clarity). I also run creative strategy, landing pages and email/retention when needed to make the funnel work end-to-end.",
  },
];

const FAQ = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="py-24 lg:py-32 bg-secondary/40">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="container mx-auto px-6 max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              FAQ
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-3">
              Answers to common <span className="text-gradient">questions</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              Everything you need to know before we jump on a call.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="font-display text-left text-base md:text-lg hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQ;