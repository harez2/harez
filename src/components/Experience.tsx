import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    title: "Manager, Digital Marketing",
    company: "Starkology Solution Limited",
    period: "June 2025 – Present",
    highlights: [
      "Leading the digital marketing team",
      "Developing and executing digital marketing strategies to boost clients and projects",
      "Managing and supervising clients' digital marketing campaigns",
      "Ensuring ROAS remains above 5-8X tailored to various client needs",
    ],
  },
  {
    title: "Performance Marketer",
    company: "Light of Hope Ltd.",
    period: "Apr 2024 – June 2025",
    highlights: [
      "Achieved 15X increase in Revenue through optimized campaigns",
      "Managed campaigns across Facebook, Google, and other platforms",
      "Strategized data-driven campaigns for lead generation and ROI optimization",
      "Collaborated with creative team for campaign-aligned content",
    ],
  },
  {
    title: "Media Buyer",
    company: "The Prestige Magazine",
    period: "Jul 2023 - Apr 2024",
    highlights: [
      "Increased brand visibility and engagement by 25%",
      "Achieved 30% increase in ROI through optimized campaigns",
      "Analyzed user behavior using advanced analytics tools",
    ],
  },
  {
    title: "Sr. Executive, Growth Marketing",
    company: "Kholabazaar Int. Limited",
    period: "Nov 2022 - Jul 2023",
    highlights: [
      "Reduced customer acquisition costs by 15%",
      "Conducted A/B testing on creatives and audience targeting",
      "Developed detailed performance reports and campaign databases",
    ],
  },
  {
    title: "Digital Marketing Strategist",
    company: "Khaas Food Ltd.",
    period: "Dec 2021 - Oct 2022",
    highlights: [
      "Executed multi-channel campaigns including SEO, social media, and email",
      "Increased organic traffic by 40% through SEO efforts",
      "Created content calendars and coordinated promotional materials",
    ],
  },
  {
    title: "Executive (Team Lead), Social Communication",
    company: "Evaly.com.bd",
    period: "Aug 2020 - Nov 2021",
    highlights: [
      "Led social communication team for one of Bangladesh's largest e-commerce platforms",
    ],
  },
];

const education = [
  {
    degree: "Master of Business Administration (MBA) in Marketing",
    institution: "IBA - Jahangirnagar University",
    period: "Enrolled - Fall 2022",
  },
  {
    degree: "Master of Science in Mathematics",
    institution: "National University",
    period: "2019",
  },
  {
    degree: "Bachelor of Science in Mathematics",
    institution: "National University",
    period: "2018",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            My Journey
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Professional <span className="text-gradient italic">Experience</span>
          </h2>
          <p className="font-body text-muted-foreground">
            A track record of driving growth and delivering results across 
            diverse industries and platforms.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Experience Timeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Work Experience
              </h3>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    
                    <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-gold transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h4 className="font-display text-lg font-semibold text-foreground">
                            {exp.title}
                          </h4>
                          <p className="font-body text-primary">{exp.company}</p>
                        </div>
                        <span className="font-body text-sm text-muted-foreground whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="font-body text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Education
              </h3>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-gold transition-all duration-300"
                >
                  <h4 className="font-display text-base font-semibold text-foreground mb-2">
                    {edu.degree}
                  </h4>
                  <p className="font-body text-sm text-primary mb-1">{edu.institution}</p>
                  <p className="font-body text-sm text-muted-foreground">{edu.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
