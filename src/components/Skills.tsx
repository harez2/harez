import { Target, TrendingUp, BarChart3, Search, Mail, Users } from "lucide-react";

const skills = [
  {
    icon: Target,
    title: "Paid Advertising",
    description: "Expert in running high-performing campaigns across major advertising platforms.",
    technologies: ["Facebook/Meta Ads", "Google Ads", "TikTok Ads", "Campaign Optimization"],
  },
  {
    icon: TrendingUp,
    title: "Growth Marketing",
    description: "Driving sustainable growth through strategic marketing initiatives and lead generation.",
    technologies: ["Lead Generation", "A/B Testing", "Conversion API", "Digital Strategy"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Data",
    description: "Making data-driven decisions using advanced analytics and tracking tools.",
    technologies: ["Web Analytics", "Google Tag Manager", "Pixel", "Data Analysis"],
  },
  {
    icon: Search,
    title: "SEO & Organic",
    description: "Optimizing web presence for search engines and organic traffic growth.",
    technologies: ["On-page SEO", "Keyword Research", "Content Strategy", "Technical SEO"],
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Creating effective email campaigns for engagement and conversion.",
    technologies: ["Email Campaigns", "Automation", "Segmentation", "A/B Testing"],
  },
  {
    icon: Users,
    title: "Team Leadership",
    description: "Leading teams and collaborating with agencies to achieve marketing goals.",
    technologies: ["Team Management", "Agency Collaboration", "Negotiation", "Strategy"],
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
            A comprehensive toolkit for driving digital growth, from media buying 
            to analytics and team leadership.
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
