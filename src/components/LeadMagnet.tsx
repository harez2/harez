import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "./ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const INCLUDES = [
  "Website audit",
  "SEO audit",
  "Meta Ads audit",
  "Landing page review",
  "Competitor analysis",
  "30-minute consultation",
];

const LeadMagnet = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    website: "",
    monthly_ad_spend: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) {
      toast.error("Name and email are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("audit_requests").insert({
        name,
        email,
        company: form.company.trim() || null,
        website: form.website.trim() || null,
        monthly_ad_spend: form.monthly_ad_spend.trim() || null,
      });
      if (error) throw error;

      // Notify via existing contact-email function (fire-and-forget).
      supabase.functions
        .invoke("send-contact-email", {
          body: {
            name,
            email,
            message: `Free growth audit request.\nCompany: ${form.company || "-"}\nWebsite: ${form.website || "-"}\nMonthly ad spend: ${form.monthly_ad_spend || "-"}`,
          },
        })
        .catch(() => {});

      setDone(true);
      toast.success("Audit request received. I'll reach out within 24 hours.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="lead-magnet" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="container mx-auto px-6 relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal>
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                100% free — no obligations
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-4 leading-tight">
                Get your <span className="text-gradient">FREE Growth Audit</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                A no-fluff diagnostic of where your marketing is leaking revenue — and what to fix first.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {INCLUDES.map((i) => (
                  <li key={i} className="flex items-center gap-2 font-body text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="relative rounded-3xl bg-card border border-border shadow-crystal p-8 lg:p-10">
              {done ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl mb-2">Request received</h3>
                  <p className="font-body text-muted-foreground">
                    I'll review your business and email you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="Full name *"
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                      maxLength={100}
                      required
                    />
                    <Field
                      label="Company"
                      value={form.company}
                      onChange={(v) => setForm({ ...form, company: v })}
                      maxLength={200}
                    />
                  </div>
                  <Field
                    label="Website"
                    value={form.website}
                    onChange={(v) => setForm({ ...form, website: v })}
                    placeholder="https://"
                    maxLength={500}
                  />
                  <Field
                    label="Monthly ad spend"
                    value={form.monthly_ad_spend}
                    onChange={(v) => setForm({ ...form, monthly_ad_spend: v })}
                    placeholder="$0 – $50K+"
                    maxLength={100}
                  />
                  <Field
                    label="Email *"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    maxLength={255}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 px-6 py-4 bg-gradient-crystal text-primary-foreground font-body font-semibold rounded-xl shadow-crystal hover:shadow-glow transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      "Get my free audit"
                    )}
                  </button>
                  <p className="font-body text-[11px] text-muted-foreground text-center">
                    Your info stays private. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}) => (
  <label className="block">
    <span className="font-body text-sm text-foreground block mb-1.5">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
    />
  </label>
);

export default LeadMagnet;