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
                <span className="font-display text-9xl text-primary/20 select-none">HA</span>
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
              Passionate about creating
              <span className="text-gradient italic"> meaningful</span> digital products
            </h2>
            <div className="space-y-6 font-body text-muted-foreground">
              <p>
                I'm a developer and designer with a passion for creating beautiful, 
                functional digital experiences. With a background in both design and 
                development, I bring a unique perspective to every project.
              </p>
              <p>
                My approach combines clean code with thoughtful design, ensuring that 
                every product I create is not only visually stunning but also performs 
                exceptionally. I believe in the power of details and the importance of 
                user-centered design.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, 
                contributing to open-source projects, or sketching ideas for my next 
                creative endeavor.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">50+</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Projects Completed</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">30+</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Happy Clients</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">10+</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Awards Won</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
