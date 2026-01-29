const About = () => {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto lg:mx-0 relative">
              {/* Crystal card effect */}
              <div className="absolute inset-0 bg-gradient-crystal rounded-3xl opacity-10" />
              <div className="absolute inset-0 bg-card rounded-3xl border border-border shadow-crystal" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-8xl font-bold text-gradient opacity-30">HAB</span>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-crystal rounded-2xl opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-2xl blur-xl" />
            </div>
            
            {/* Stats badge */}
            <div className="absolute -bottom-6 -right-6 lg:right-auto lg:left-full lg:-ml-12 bg-card border border-border rounded-2xl p-5 shadow-crystal">
              <p className="font-display text-4xl font-bold text-gradient">5+</p>
              <p className="font-body text-sm text-muted-foreground mt-1">Years Experience</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <p className="font-body text-sm font-medium text-primary mb-4 tracking-wide">About Me</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Data-driven marketer with a passion for{" "}
              <span className="text-gradient">growth</span>
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                I'm a Digital Marketing Manager with extensive experience in media buying, 
                lead generation, and growth marketing. I specialize in executing campaigns 
                that maximize ROI and drive meaningful business results.
              </p>
              <p>
                My expertise spans Facebook/Meta Ads, Google Ads, TikTok Ads, and comprehensive 
                web analytics. I've consistently delivered exceptional outcomes, including 15X 
                revenue increases and maintaining ROAS above 5-8X.
              </p>
              <p>
                Currently pursuing my MBA in Marketing from IBA - Jahangirnagar University, 
                combining academic insights with hands-on experience.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border">
              <div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">15X</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Revenue Growth</p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">5-8X</p>
                <p className="font-body text-sm text-muted-foreground mt-1">ROAS Achieved</p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">40%</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Organic Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
