import { ArrowDown } from "lucide-react";
import { useSiteContent, HeroContent } from "@/hooks/useSiteContent";

const Hero = () => {
  const { data: content } = useSiteContent<HeroContent>("hero");

  const badge = content?.badge || "Digital Marketing Manager";
  const name = content?.name || "Md Harez";
  const nameHighlight = content?.nameHighlight || "Al Baki";
  const subtitle = content?.subtitle || "Driving growth through data-driven campaigns. 5+ years of expertise in media buying, lead generation, and performance marketing.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] crystal-orb animate-float" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] crystal-orb animate-float animation-delay-400" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] crystal-orb opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-8 opacity-0 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-gradient-crystal" />
            <span className="font-body text-sm text-muted-foreground">{badge}</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 opacity-0 animate-fade-up animation-delay-100">
            {name}{" "}
            <span className="text-gradient">{nameHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 opacity-0 animate-fade-up animation-delay-200 leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up animation-delay-300">
            <a
              href="#experience"
              className="group px-8 py-4 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-xl shadow-crystal hover:shadow-glow transition-all duration-300 flex items-center gap-3"
            >
              View Experience
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-card border border-border text-foreground font-body font-medium rounded-xl shadow-soft hover:border-primary/50 hover:shadow-crystal transition-all duration-300"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-800">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="font-body text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
