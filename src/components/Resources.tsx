import { useState } from "react";
import { FileText, Download, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "./ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackLead } from "@/lib/analytics";

interface Resource {
  slug: string;
  title: string;
  description: string;
  bullets: string[];
  file: string;
  badge: string;
}

const RESOURCES: Resource[] = [
  {
    slug: "meta-ads-scaling-playbook",
    title: "The Meta Ads Scaling Playbook",
    description:
      "The exact framework I use to scale Meta ad accounts from $1K to $50K/month without breaking ROAS.",
    bullets: ["Account structure blueprint", "Creative testing framework", "Scaling decision tree"],
    file: "/resources/meta-ads-scaling-playbook.pdf",
    badge: "42-page PDF",
  },
  {
    slug: "growth-audit-checklist",
    title: "The 47-Point Growth Audit Checklist",
    description:
      "The same checklist I run on every new client account — spot revenue leaks in tracking, funnel and creative.",
    bullets: ["Tracking & attribution", "Funnel & CRO", "Creative & messaging"],
    file: "/resources/growth-audit-checklist.pdf",
    badge: "Checklist",
  },
  {
    slug: "google-ads-lead-gen-blueprint",
    title: "Google Ads Lead-Gen Blueprint",
    description:
      "Turn Google Ads into a predictable pipeline for B2B and high-ticket services with offline conversion tracking.",
    bullets: ["Keyword & intent map", "Landing page structure", "SQL feedback loop"],
    file: "/resources/google-ads-lead-gen-blueprint.pdf",
    badge: "Blueprint",
  },
];

const Resources = () => {
  const [active, setActive] = useState<Resource | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim() || !emailRegex.test(email.trim())) {
      toast.error("Please enter your name and a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("audit_requests").insert({
        name: name.trim(),
        email: email.trim(),
        company: `Resource: ${active.title}`,
      });
      if (error) throw error;
      trackLead(`resource:${active.slug}`);
      toast.success("Download starting — check your email for extras.");
      window.open(active.file, "_blank", "noopener,noreferrer");
      setActive(null);
      setEmail("");
      setName("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="resources" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              Free Resources
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-3">
              Playbooks and <span className="text-gradient">frameworks</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              The same tools and checklists I use with paying clients — yours, free.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {RESOURCES.map((r, i) => (
            <ScrollReveal key={r.slug} delay={i * 80}>
              <article className="h-full flex flex-col p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-crystal hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="font-body text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                  {r.badge}
                </div>
                <h3 className="font-display text-xl mb-3">{r.title}</h3>
                <p className="font-body text-sm text-muted-foreground mb-5 flex-grow">
                  {r.description}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setActive(r)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-crystal text-primary-foreground font-body text-sm font-semibold shadow-crystal hover:shadow-glow transition-all"
                >
                  <Download className="w-4 h-4" /> Free download
                </button>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{active?.title}</DialogTitle>
            <DialogDescription>
              Enter your details to get the download — I'll also send bonus notes by email.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="res-name">Full name</Label>
              <Input
                id="res-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-email">Email</Label>
              <Input
                id="res-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 rounded-lg bg-gradient-crystal text-primary-foreground font-body font-semibold shadow-crystal hover:shadow-glow transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Preparing…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Send me the PDF
                </>
              )}
            </button>
            <p className="font-body text-[11px] text-muted-foreground text-center">
              We respect your inbox. Unsubscribe anytime.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Resources;