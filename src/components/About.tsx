const About = () => {
  return (
    <section id="about" className="py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left side - Image/Visual */}
          <div className="relative">
            <div className="aspect-[4/5] bg-secondary rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-9xl text-primary/20 select-none">HAB</span>
              </div>
              {/* Decorative frame */}
              <div className="absolute inset-4 border border-primary/30 rounded-xl pointer-events-none" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl p-6 shadow-card">
              <p className="font-display text-4xl font-semibold text-primary">5+</p>
              <p className="font-body text-sm text-muted-foreground mt-1">Years of Experience</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">About Me</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8">
              Passionate about
              <span className="text-gradient italic"> data-driven</span> marketing
            </h2>
            <div className="space-y-6 font-body text-muted-foreground">
              <p>
                I'm a Digital Marketing Manager with more than five years of experience 
                in media buying, lead generation, and growth marketing. I specialize in 
                executing data-driven campaigns that maximize ROI and drive meaningful results.
              </p>
              <p>
                My expertise spans across Facebook/Meta Ads, Google Ads, TikTok Ads, and 
                comprehensive web analytics. I've consistently delivered exceptional results, 
                including achieving 15X revenue increases and maintaining ROAS above 5-8X 
                for various clients.
              </p>
              <p>
                Currently pursuing my MBA in Marketing from IBA - Jahangirnagar University, 
                I combine academic knowledge with hands-on experience to develop strategies 
                that truly impact business growth.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">15X</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Revenue Increase</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">5-8X</p>
                <p className="font-body text-sm text-muted-foreground mt-1">ROAS Achieved</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">40%</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Organic Traffic Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
