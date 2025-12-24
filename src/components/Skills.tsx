import { Code2, Palette, Layout, Zap, Globe, Cpu } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Frontend Development",
    description: "Building responsive and interactive web applications using modern frameworks.",
    technologies: ["React", "TypeScript", "Next.js", "Vue"],
  },
  {
    icon: Cpu,
    title: "Backend Development",
    description: "Creating robust server-side solutions and APIs for scalable applications.",
    technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Designing intuitive interfaces that prioritize user experience and aesthetics.",
    technologies: ["Figma", "Adobe XD", "Sketch", "Framer"],
  },
  {
    icon: Layout,
    title: "Responsive Design",
    description: "Crafting layouts that work seamlessly across all devices and screen sizes.",
    technologies: ["Tailwind CSS", "CSS Grid", "Flexbox", "Mobile-First"],
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimizing applications for speed, efficiency, and excellent user experience.",
    technologies: ["Webpack", "Lazy Loading", "Caching", "CDN"],
  },
  {
    icon: Globe,
    title: "Web Standards",
    description: "Following best practices for accessibility, SEO, and modern web standards.",
    technologies: ["WCAG", "SEO", "PWA", "Web Vitals"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-32 bg-secondary/50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            What I Do
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Skills & <span className="text-gradient italic">Expertise</span>
          </h2>
          <p className="font-body text-muted-foreground">
            A comprehensive toolkit for building exceptional digital products, 
            from concept to deployment.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.title}
              className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/50 hover:shadow-gold transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <skill.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {skill.title}
              </h3>
              <p className="font-body text-muted-foreground text-sm mb-6">
                {skill.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {skill.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-body text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
