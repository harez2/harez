import { useConsultationReviews } from "@/hooks/useConsultation";
import { Star, Quote } from "lucide-react";

const ConsultationReviews = () => {
  const { data: reviews } = useConsultationReviews();

  if (!reviews?.length) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">What Clients Say</h2>
          <p className="font-body text-muted-foreground">Hear from businesses I've helped grow.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-crystal transition-all"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
                "{review.review_text}"
              </p>
              <div className="flex items-center gap-3">
                {review.client_photo ? (
                  <img
                    src={review.client_photo}
                    alt={review.client_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-display text-sm font-bold text-primary">
                      {review.client_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{review.client_name}</p>
                  {review.client_company && (
                    <p className="font-body text-xs text-muted-foreground">{review.client_company}</p>
                  )}
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultationReviews;
