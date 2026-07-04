import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCustomizationsContext } from "@/contexts/CustomizationsContext";

interface NavLink { href: string; label: string; isRoute: boolean }

const DEFAULT_LINKS: NavLink[] = [
  { href: "#home", label: "Home", isRoute: false },
  { href: "#about", label: "About", isRoute: false },
  { href: "#services", label: "Services", isRoute: false },
  { href: "#case-studies", label: "Case Studies", isRoute: false },
  { href: "#industries", label: "Industries", isRoute: false },
  { href: "/blog", label: "Resources", isRoute: true },
  { href: "#contact", label: "Contact", isRoute: false },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { navigation } = useCustomizationsContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoText = navigation?.logoText || "Harez";
  const showThemeToggle = navigation?.showThemeToggle ?? true;
  const links = DEFAULT_LINKS;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-glass border-b border-border/60 shadow-soft py-2" : "bg-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <a href="#home" className="font-display text-lg font-extrabold text-foreground">
            {logoText}<span className="text-gradient">.</span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.href}
                  to={l.href}
                  className="px-3 py-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ),
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {showThemeToggle && <ThemeToggle />}
            <a
              href="#lead-magnet"
              className="group inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-crystal text-primary-foreground font-body text-sm font-semibold rounded-lg shadow-crystal hover:shadow-glow transition-all"
            >
              Book Free Strategy Call
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-0.5 bg-foreground transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-foreground transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-foreground transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[500px] pb-6" : "max-h-0"}`}>
          <div className="flex flex-col gap-1 pt-4 border-t border-border">
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-muted-foreground hover:text-foreground transition-colors py-2.5"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-muted-foreground hover:text-foreground transition-colors py-2.5"
                >
                  {l.label}
                </a>
              ),
            )}
            {showThemeToggle && (
              <div className="py-2">
                <ThemeToggle />
              </div>
            )}
            <a
              href="#lead-magnet"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-5 py-3 bg-gradient-crystal text-primary-foreground font-body text-sm font-semibold rounded-lg text-center"
            >
              Book Free Strategy Call
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
