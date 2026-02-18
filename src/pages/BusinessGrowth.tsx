import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import ConsultationHero from "@/components/consultation/ConsultationHero";
import ConsultationProjects from "@/components/consultation/ConsultationProjects";
import ConsultationVideo from "@/components/consultation/ConsultationVideo";
import ConsultationBenefits from "@/components/consultation/ConsultationBenefits";
import ConsultationReviews from "@/components/consultation/ConsultationReviews";
import BookingForm from "@/components/consultation/BookingForm";
import ThemeToggle from "@/components/ThemeToggle";

const BusinessGrowth = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Business Growth 1:1 Session"
        description="Book a personalized business growth consultation session. Get expert guidance on strategy, marketing, and scaling your business."
      />

      {/* Simple Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="pt-16">
        <ConsultationHero />
        <ConsultationProjects />
        <ConsultationVideo />
        <ConsultationBenefits />
        <ConsultationReviews />
        <BookingForm />
      </div>

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessGrowth;
