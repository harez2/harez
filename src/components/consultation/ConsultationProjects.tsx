import { useConsultationProjects } from "@/hooks/useConsultation";
import { ExternalLink } from "lucide-react";

const ConsultationProjects = () => {
  const { data: projects } = useConsultationProjects();

  if (!projects?.length) return null;

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Previous Projects</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            A glimpse of successful projects and businesses I've helped grow.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-crystal transition-all"
            >
              {project.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{project.title}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-sm text-primary hover:underline"
                  >
                    View Project <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultationProjects;
