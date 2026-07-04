import { useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCustomizationsContext } from "@/contexts/CustomizationsContext";

const Footer = () => {
  const { navigation } = useCustomizationsContext();
  const logoText = navigation?.logoText || "Harez";
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    // Newsletter capture placeholder — reuses lead form endpoint if needed later.
    setTimeout(() => {
      toast.success("Thanks — you're subscribed.");
      setEmail("");
      setSubmitting(false);
    }, 500);
  };

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2 max-w-md">
            <a href="#home" className="font-display text-xl font-extrabold text-foreground">
              {logoText}<span className="text-gradient">.</span>
            </a>
            <p className="mt-3 font-body text-sm text-muted-foreground leading-relaxed">
              Performance marketing consultant helping ambitious brands turn ad spend into predictable revenue.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                maxLength={255}
                className="flex-1 px-4 py-3 bg-card border border-border rounded-xl font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-3 bg-gradient-crystal text-primary-foreground rounded-xl shadow-crystal hover:shadow-glow transition-all disabled:opacity-70"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="mt-2 font-body text-[11px] text-muted-foreground">
              Monthly growth insights. No spam.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="font-display text-sm font-semibold mb-4">Explore</div>
            <ul className="space-y-2.5 font-body text-sm">
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a></li>
              <li><a href="#case-studies" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
              <li><a href="#industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</a></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Resources</Link></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-display text-sm font-semibold mb-4">Get in touch</div>
            <ul className="space-y-2.5 font-body text-sm">
              <li>
                <a href="mailto:harezalbaki@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> harezalbaki@gmail.com
                </a>
              </li>
              <li>
                <a href="https://web.whatsapp.com/send?phone=8801797395739" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/iamharez" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Md Harez Al Baki. All rights reserved.
          </p>
          <div className="flex items-center gap-5 font-body text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#home" className="hover:text-foreground transition-colors">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
