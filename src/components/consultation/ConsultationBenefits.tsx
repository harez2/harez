import { useConsultationContent } from "@/hooks/useConsultation";
import { CheckCircle, Target, TrendingUp, Lightbulb, Users, BarChart3 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  CheckCircle, Target, TrendingUp, Lightbulb, Users, BarChart3,
};

const defaultBenefits = [
  { icon: "Target", title: "Personalized Strategy", description: "Get a custom growth plan tailored specifically to your business goals." },
  { icon: "TrendingUp", title: "Revenue Growth", description: "Proven tactics to increase your revenue streams and profitability." },
  { icon: "Lightbulb", title: "Expert Insights", description: "Leverage years of experience across multiple industries." },
  { icon: "BarChart3", title: "Data-Driven Decisions", description: "Make informed decisions backed by analytics and market research." },
];

const ConsultationBenefits = () => {
  const { data: benefitsContent } = useConsultationContent("benefits");
  const content = benefitsContent?.content || {};

  const title = content.title || "Why Book a Session?";
  const benefits = content.items?.length ? content.items : defaultBenefits;

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">{title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit: any, index: number) => {
            const Icon = iconMap[benefit.icon] || CheckCircle;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-crystal transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConsultationBenefits;
