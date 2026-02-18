import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useCustomizationsContext } from "@/contexts/CustomizationsContext";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { navigation } = useCustomizationsContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use customized menu items or defaults
  const menuItems = navigation?.menuItems || ["About", "Skills", "Experience", "Blog", "Contact"];
  const logoText = navigation?.logoText || "HAB";
  const showLogo = navigation?.showLogo ?? true;
  const showThemeToggle = navigation?.showThemeToggle ?? true;
  const stickyHeader = navigation?.stickyHeader ?? true;

  const navLinks = menuItems.map((item) => {
    const lower = item.toLowerCase();
    const isRoute = lower === "blog" || lower === "1:1 session";
    const href = lower === "blog" ? "/blog" : lower === "1:1 session" ? "/business-growth" : `#${lower}`;
    return { href, label: item, isRoute };
  });

  return (
    <nav
      className={`${stickyHeader ? "fixed" : "absolute"} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-glass border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {showLogo && (
            <a
              href="#"
              className="font-display text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {logoText}<span className="text-gradient">.</span>
            </a>
          )}
          {!showLogo && <div />}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            {showThemeToggle && <ThemeToggle />}
            <a
              href="#contact"
              className="px-5 py-2 bg-gradient-crystal text-primary-foreground font-body text-sm font-medium rounded-lg shadow-soft hover:shadow-crystal transition-all"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-64 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              )
            )}
            {showThemeToggle && (
              <div className="py-2">
                <ThemeToggle />
              </div>
            )}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="px-5 py-3 bg-gradient-crystal text-primary-foreground font-body text-sm font-medium rounded-lg text-center mt-2"
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
