import { Briefcase, GraduationCap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const experiences = [
  {
    title: "Manager, Digital Marketing",
    company: "Starkology Solution Limited",
    period: "June 2025 – Present",
    highlights: [
      "Leading the digital marketing team",
      "Developing strategies to boost clients and projects",
      "Ensuring ROAS remains above 5-8X",
    ],
  },
  {
    title: "Performance Marketer",
    company: "Light of Hope Ltd.",
    period: "Apr 2024 – June 2025",
    highlights: [
      "Achieved 15X increase in Revenue",
      "Managed campaigns across Facebook, Google, and other platforms",
      "Strategized data-driven campaigns for ROI optimization",
    ],
  },
  {
    title: "Media Buyer",
    company: "The Prestige Magazine",
    period: "Jul 2023 - Apr 2024",
    highlights: [
      "Increased brand visibility by 25%",
      "Achieved 30% increase in ROI",
    ],
  },
  {
    title: "Sr. Executive, Growth Marketing",
    company: "Kholabazaar Int. Limited",
    period: "Nov 2022 - Jul 2023",
    highlights: [
      "Reduced customer acquisition costs by 15%",
      "Conducted A/B testing on creatives",
    ],
  },
  {
    title: "Digital Marketing Strategist",
    company: "Khaas Food Ltd.",
    period: "Dec 2021 - Oct 2022",
    highlights: [
      "Increased organic traffic by 40%",
      "Executed multi-channel campaigns",
    ],
  },
];

const education = [
  {
    degree: "MBA in Marketing",
    institution: "IBA - Jahangirnagar University",
    period: "2022 – Present",
  },
  {
    degree: "M.Sc. in Mathematics",
    institution: "National University",
    period: "2019",
  },
  {
    degree: "B.Sc. in Mathematics",
    institution: "National University",
    period: "2018",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="font-body text-sm font-medium text-primary mb-4 tracking-wide">
              Journey
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Professional <span className="text-gradient">Experience</span>
            </h2>
            <p className="font-body text-muted-foreground">
              A track record of driving growth across diverse industries.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Experience Timeline */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-crystal flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Work Experience
                </h3>
              </div>
            </ScrollReveal>
            
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <ScrollReveal key={index} delay={index * 80}>
                  <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-crystal hover:border-primary/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                      <div>
                        <h4 className="font-display text-base font-semibold text-foreground">
                          {exp.title}
                        </h4>
                        <p className="font-body text-sm text-primary">{exp.company}</p>
                      </div>
                      <span className="font-body text-xs text-muted-foreground px-3 py-1 bg-secondary rounded-full whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="font-body text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <ScrollReveal delay={100}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-crystal flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Education
                </h3>
              </div>
            </ScrollReveal>
            
            <div className="space-y-4">
              {education.map((edu, index) => (
                <ScrollReveal key={index} delay={150 + index * 100}>
                  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-crystal hover:border-primary/30 transition-all duration-300">
                    <h4 className="font-display text-sm font-semibold text-foreground mb-1">
                      {edu.degree}
                    </h4>
                    <p className="font-body text-sm text-primary mb-1">{edu.institution}</p>
                    <p className="font-body text-xs text-muted-foreground">{edu.period}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
