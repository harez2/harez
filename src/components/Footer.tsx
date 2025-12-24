const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="font-display text-2xl font-semibold text-foreground">
            HA<span className="text-primary">.</span>
          </a>

          {/* Copyright */}
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Harez Albaki. All rights reserved.
          </p>

          {/* Back to top */}
          <a
            href="#"
            className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            Back to top
            <span className="rotate-180">↓</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
