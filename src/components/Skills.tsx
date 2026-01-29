import { Target, TrendingUp, BarChart3, Search, Mail, Users } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const skills = [
  {
    icon: Target,
    title: "Paid Advertising",
    description: "High-performing campaigns across major platforms.",
    technologies: ["Meta Ads", "Google Ads", "TikTok Ads", "Campaign Optimization"],
  },
  {
    icon: TrendingUp,
    title: "Growth Marketing",
    description: "Strategic initiatives for sustainable growth.",
    technologies: ["Lead Generation", "A/B Testing", "Conversion API", "Digital Strategy"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Data",
    description: "Data-driven decisions with advanced tracking.",
    technologies: ["Web Analytics", "Google Tag Manager", "Pixel", "Data Analysis"],
  },
  {
    icon: Search,
    title: "SEO & Organic",
    description: "Optimizing presence for organic growth.",
    technologies: ["On-page SEO", "Keyword Research", "Content Strategy", "Technical SEO"],
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Effective campaigns for engagement.",
    technologies: ["Email Campaigns", "Automation", "Segmentation", "A/B Testing"],
  },
  {
    icon: Users,
    title: "Team Leadership",
    description: "Leading teams to achieve goals.",
    technologies: ["Team Management", "Agency Collaboration", "Negotiation", "Strategy"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="font-body text-sm font-medium text-primary mb-4 tracking-wide">
              Expertise
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Skills & <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="font-body text-muted-foreground">
              A comprehensive toolkit for driving digital growth and business results.
            </p>
          </div>
        </ScrollReveal>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, index) => (
            <ScrollReveal key={skill.title} delay={index * 100}>
              <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-crystal hover:border-primary/30 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-crystal flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <skill.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {skill.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-5">
                  {skill.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-body text-xs px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
