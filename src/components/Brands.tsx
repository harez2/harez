import { useBrands } from "@/hooks/useSiteContent";
import ScrollReveal from "./ScrollReveal";

const Brands = () => {
  const { data: brands, isLoading } = useBrands();

  if (isLoading) {
    return (
      <section id="brands" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="h-8 w-64 bg-muted animate-pulse rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!brands || brands.length === 0) {
    return null;
  }

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section id="brands" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 crystal-orb opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 crystal-orb opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-body font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              Trusted Partners
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Brands I <span className="text-gradient">Worked With</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Collaborated with industry-leading brands to deliver exceptional digital marketing results
            </p>
          </div>
        </ScrollReveal>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* First row - scrolls left */}
          <div className="overflow-hidden mb-6">
            <div className="flex animate-marquee hover:pause-animation">
              {duplicatedBrands.map((brand, index) => (
                <BrandCard key={`row1-${brand.id}-${index}`} brand={brand} />
              ))}
            </div>
          </div>
          
          {/* Second row - scrolls right */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee-reverse hover:pause-animation">
              {duplicatedBrands.reverse().map((brand, index) => (
                <BrandCard key={`row2-${brand.id}-${index}`} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    logo_url: string;
    website_url?: string | null;
  };
}

const BrandCard = ({ brand }: BrandCardProps) => {
  const content = (
    <div className="group relative flex-shrink-0 mx-4 w-40 h-24 flex items-center justify-center">
      {/* Glassmorphism card */}
      <div className="absolute inset-0 bg-glass border border-glass rounded-2xl shadow-soft transition-all duration-500 group-hover:shadow-glow group-hover:border-primary/30 group-hover:scale-105">
        {/* Holographic shimmer effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-shine animate-shimmer" />
        </div>
        
        {/* Neon glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-crystal rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
      </div>
      
      {/* Logo */}
      <img
        src={brand.logo_url}
        alt={brand.name}
        className="relative z-10 max-w-[80%] max-h-[60%] object-contain filter transition-all duration-300 group-hover:brightness-110 dark:brightness-90 dark:group-hover:brightness-110"
      />
    </div>
  );

  if (brand.website_url) {
    return (
      <a
        href={brand.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default Brands;
