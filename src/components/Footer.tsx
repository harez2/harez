import { Settings } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="font-display text-lg font-bold text-foreground">
            HAB<span className="text-gradient">.</span>
          </a>

          {/* Copyright */}
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Md Harez Al Baki
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Admin
            </a>
            <a
              href="#"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              Back to top
              <span className="text-xs">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
