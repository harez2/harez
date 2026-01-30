import { useCustomizationsContext } from "@/contexts/CustomizationsContext";

const Footer = () => {
  const { navigation } = useCustomizationsContext();
  const logoText = navigation?.logoText || "HAB";
  const showLogo = navigation?.showLogo ?? true;

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          {showLogo && (
            <a href="#" className="font-display text-lg font-bold text-foreground">
              {logoText}<span className="text-gradient">.</span>
            </a>
          )}
          {!showLogo && <div />}

          {/* Copyright */}
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Md Harez Al Baki
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
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
