import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "A modern e-commerce solution with seamless checkout experience and inventory management.",
    technologies: ["React", "Node.js", "Stripe", "MongoDB"],
    image: "linear-gradient(135deg, hsl(220, 60%, 30%), hsl(280, 60%, 40%))",
  },
  {
    title: "Finance Dashboard",
    category: "UI/UX Design",
    description: "Intuitive financial dashboard for tracking investments and managing portfolios.",
    technologies: ["Next.js", "TypeScript", "D3.js", "Tailwind"],
    image: "linear-gradient(135deg, hsl(160, 60%, 30%), hsl(200, 60%, 40%))",
  },
  {
    title: "Social Media App",
    category: "Mobile Development",
    description: "Feature-rich social platform with real-time messaging and content sharing.",
    technologies: ["React Native", "Firebase", "Redux", "Node.js"],
    image: "linear-gradient(135deg, hsl(340, 60%, 40%), hsl(20, 60%, 50%))",
  },
  {
    title: "AI Content Generator",
    category: "Web Application",
    description: "AI-powered platform for generating marketing copy and creative content.",
    technologies: ["Python", "OpenAI", "React", "FastAPI"],
    image: "linear-gradient(135deg, hsl(43, 74%, 30%), hsl(43, 80%, 50%))",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Featured <span className="text-gradient italic">Projects</span>
          </h2>
          <p className="font-body text-muted-foreground">
            A selection of projects that showcase my expertise in design and development.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              {/* Project Image/Preview */}
              <div
                className="aspect-[16/10] relative overflow-hidden"
                style={{ background: project.image }}
              >
                <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors" />
                
                {/* Hover overlay with links */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Github className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-8">
                <p className="font-body text-xs tracking-widest uppercase text-primary mb-2">
                  {project.category}
                </p>
                <h3 className="font-display text-2xl font-semibold mb-3 text-foreground">
                  {project.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm mb-6">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-body text-xs px-3 py-1 rounded-full border border-border text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <a
            href="#"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:text-gold-light transition-colors group"
          >
            View All Projects
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
