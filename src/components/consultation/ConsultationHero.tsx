import { useConsultationContent } from "@/hooks/useConsultation";
import profilePhoto from "@/assets/profile-photo.png";

const ConsultationHero = () => {
  const { data: heroContent } = useConsultationContent("hero");
  const content = heroContent?.content || {};

  const headline = content.headline || "Grow Your Business with Expert Guidance";
  const subtitle = content.subtitle || "1:1 Business Growth Consultation";
  const bio = content.bio || "Get personalized strategies and actionable insights to scale your business. With years of experience in digital marketing and business development, I'll help you identify growth opportunities and build a clear roadmap to success.";

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-body text-sm font-medium rounded-full mb-6">
              {subtitle}
            </span>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
              {headline}
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {bio}
            </p>
            <a
              href="#booking"
              className="inline-flex px-8 py-4 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-xl shadow-crystal hover:shadow-glow transition-all"
            >
              Book Your Session
            </a>
          </div>
          <div className="flex-shrink-0">
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border-2 border-border shadow-crystal">
              <img
                src={content.image_url || profilePhoto}
                alt="Consultant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationHero;
