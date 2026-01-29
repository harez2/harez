import { Mail, MapPin, Phone, Send, Linkedin } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left side - Contact Info */}
          <div>
            <p className="font-body text-sm font-medium text-primary mb-4 tracking-wide">
              Contact
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Let's work <span className="text-gradient">together</span>
            </h2>
            <p className="font-body text-muted-foreground mb-10 max-w-md leading-relaxed">
              Looking to boost your digital marketing performance? Let's discuss 
              how I can help drive growth for your business.
            </p>

            {/* Contact Details */}
            <div className="space-y-4 mb-10">
              <a href="mailto:harezalbaki@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-crystal transition-all">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Email</p>
                  <p className="font-body text-foreground group-hover:text-primary transition-colors">
                    harezalbaki@gmail.com
                  </p>
                </div>
              </a>
              <a href="tel:+8801797395739" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-crystal transition-all">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Phone</p>
                  <p className="font-body text-foreground group-hover:text-primary transition-colors">
                    +880 1797 395739
                  </p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Location</p>
                  <p className="font-body text-foreground">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/iamharez"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:shadow-crystal transition-all"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a
                href="https://facebook.com/imharez"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:shadow-crystal transition-all"
              >
                <svg className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-crystal">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="font-body text-sm text-foreground block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="font-body text-sm text-foreground block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="font-body text-sm text-foreground block mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  placeholder="Tell me about your project..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-xl shadow-crystal hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
