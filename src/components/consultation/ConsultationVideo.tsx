import { useConsultationContent } from "@/hooks/useConsultation";

const ConsultationVideo = () => {
  const { data: videoContent } = useConsultationContent("video");
  const content = videoContent?.content || {};

  const title = content.title || "Watch How I Can Help You Grow";
  const description = content.description || "Learn about my approach to business growth and what you can expect from our 1:1 sessions.";
  const videoUrl = content.video_url || "";

  if (!videoUrl) return null;

  // Convert YouTube URLs to embed format
  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">{title}</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-crystal">
            <iframe
              src={getEmbedUrl(videoUrl)}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationVideo;
