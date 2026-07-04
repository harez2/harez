import { Mail, MapPin, Phone, Send, Linkedin, Loader2, MessageCircle, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "./ScrollReveal";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        },
      });
      if (error) throw error;
      toast.success("Message sent — I'll reply within 24 hours.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              Contact
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-3">
              Let's build your <span className="text-gradient">growth engine</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              Response within 24 hours. Prefer to talk live? Book a free strategy call.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Left: booking + info */}
          <ScrollReveal>
            <div className="h-full flex flex-col gap-6">
              {/* Booking calendar placeholder */}
              <div className="rounded-2xl bg-card border border-border shadow-soft p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-display text-lg">Book a free strategy call</div>
                    <div className="font-body text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 30 minutes • Zoom or Google Meet
                    </div>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-5 leading-relaxed">
                  We'll diagnose your biggest growth bottleneck and map the first 90 days — no pitch.
                </p>
                <a
                  href="#lead-magnet"
                  className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-gradient-crystal text-primary-foreground font-body font-semibold rounded-xl shadow-crystal hover:shadow-glow transition-all"
                >
                  Reserve your slot
                </a>
              </div>

              {/* Contact rows */}
              <div className="rounded-2xl bg-card border border-border shadow-soft p-6 space-y-4">
                <ContactRow icon={Mail} label="Email" value="harezalbaki@gmail.com" href="mailto:harezalbaki@gmail.com" />
                <ContactRow icon={MessageCircle} label="WhatsApp" value="+880 1797 395 739" href="https://web.whatsapp.com/send?phone=8801797395739" external />
                <ContactRow icon={Linkedin} label="LinkedIn" value="linkedin.com/in/iamharez" href="https://linkedin.com/in/iamharez" external />
                <ContactRow icon={Phone} label="Phone" value="+880 1797 395 739" href="tel:+8801797395739" />
                <ContactRow icon={MapPin} label="Location" value="Dhaka, Bangladesh" />
              </div>
            </div>
          </ScrollReveal>

          {/* Right: form */}
          <ScrollReveal delay={80}>
            <div className="rounded-2xl bg-card border border-border shadow-crystal p-8">
              <div className="mb-6">
                <div className="font-display text-xl">Send a message</div>
                <div className="font-body text-sm text-muted-foreground">Not ready to book? Drop a note instead.</div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} maxLength={100} disabled={isSubmitting} />
                <FormField label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} maxLength={255} disabled={isSubmitting} />
                <div>
                  <label htmlFor="message" className="font-body text-sm block mb-1.5">Message</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    maxLength={5000}
                    disabled={isSubmitting}
                    required
                    placeholder="Tell me about your business and goals…"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-crystal text-primary-foreground font-body font-semibold rounded-xl shadow-crystal hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <>Send message <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const ContactRow = ({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) => {
  const inner = (
    <div className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-lg bg-secondary/60 border border-border flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className={`font-body text-sm truncate ${href ? "group-hover:text-primary" : ""} transition-colors`}>{value}</div>
      </div>
    </div>
  );
  if (!href) return inner;
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="block">
      {inner}
    </a>
  );
};

const FormField = ({
  label, value, onChange, type = "text", maxLength, disabled,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; maxLength?: number; disabled?: boolean }) => (
  <div>
    <label className="font-body text-sm block mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      required
      disabled={disabled}
      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
    />
  </div>
);

export default Contact;
