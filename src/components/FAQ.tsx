import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "./ScrollReveal";
import { useFaqs } from "@/hooks/useContent";

const FALLBACK = [
  {
    id: "1",
    q: "How is working with you different from hiring an agency?",
    a: "You work directly with me — no account managers, no juniors running your budget. Every strategy, creative brief and optimization decision is mine. It's the accountability of an in-house lead with the speed of a specialist.",
  },
];

const FAQ = () => {
  const { data } = useFaqs();
  const items = (data && data.length > 0)
    ? data.map((f) => ({ id: f.id, q: f.question, a: f.answer }))
    : FALLBACK;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
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
            {items.map((f, i) => (
              <AccordionItem key={f.id} value={`item-${i}`} className="border-border">
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