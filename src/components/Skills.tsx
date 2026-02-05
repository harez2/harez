import { Target, TrendingUp, BarChart3, Search, Mail, Users, LucideIcon, icons } from "lucide-react";
import { lazy, Suspense } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import ScrollReveal from "./ScrollReveal";
import { useSkills, Skill } from "@/hooks/useSiteContent";

const categoryIcons: Record<string, LucideIcon> = {
  "Paid Advertising": Target,
  "Organic Marketing": TrendingUp,
  "Analytics": BarChart3,
  "SEO": Search,
  "Email": Mail,
  "Leadership": Users,
};

// Dynamic icon component for skill icons
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const iconName = name as keyof typeof dynamicIconImports;
  if (!dynamicIconImports[iconName]) {
    return null;
  }
  const LucideIcon = lazy(dynamicIconImports[iconName]);
  return (
    <Suspense fallback={<div className="w-3.5 h-3.5" />}>
      <LucideIcon className={className} />
    </Suspense>
  );
};

const categoryDescriptions: Record<string, string> = {
  "Paid Advertising": "High-performing campaigns across major platforms.",
  "Organic Marketing": "Strategic initiatives for sustainable growth.",
  "Analytics": "Data-driven decisions with advanced tracking.",
};

const Skills = () => {
  const { data: skills } = useSkills();

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) ?? {};

  const categories = Object.keys(groupedSkills);

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
          {categories.map((category, index) => {
            const Icon = categoryIcons[category] || Target;
            const description = categoryDescriptions[category] || `Expert skills in ${category}.`;
            const categorySkills = groupedSkills[category];

            return (
              <ScrollReveal key={category} delay={index * 100}>
                <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-crystal hover:border-primary/30 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-crystal flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                    {category}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-5">
                    {description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="font-body text-xs px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground flex items-center gap-1.5"
                      >
                        {skill.icon && <DynamicIcon name={skill.icon} className="w-3.5 h-3.5" />}
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
