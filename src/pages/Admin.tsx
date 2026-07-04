import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, LogOut, Home, FileText, Briefcase, GraduationCap, MessageSquare, Building2, PenSquare, Settings, Rocket, Calendar, ClipboardList, Inbox, Quote, HelpCircle, Download, Trophy, BarChart3 } from "lucide-react";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import SkillsEditor from "@/components/admin/SkillsEditor";
import ExperienceEditor from "@/components/admin/ExperienceEditor";
import EducationEditor from "@/components/admin/EducationEditor";
import ContactEditor from "@/components/admin/ContactEditor";
import BrandsEditor from "@/components/admin/BrandsEditor";
import BlogEditor from "@/components/admin/BlogEditor";
import CustomizationsEditor from "@/components/admin/CustomizationsEditor";
import ConsultationContentEditor from "@/components/admin/ConsultationContentEditor";
import ConsultationProjectsEditor from "@/components/admin/ConsultationProjectsEditor";
import ConsultationReviewsEditor from "@/components/admin/ConsultationReviewsEditor";
import ConsultationSlotsEditor from "@/components/admin/ConsultationSlotsEditor";
import ConsultationBookingsManager from "@/components/admin/ConsultationBookingsManager";
import AuditRequestsManager from "@/components/admin/AuditRequestsManager";
import TestimonialsEditor from "@/components/admin/TestimonialsEditor";
import FaqsEditor from "@/components/admin/FaqsEditor";
import ResourcesEditor from "@/components/admin/ResourcesEditor";
import CaseStudiesEditor from "@/components/admin/CaseStudiesEditor";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

type Tab = "hero" | "about" | "skills" | "brands" | "experience" | "education" | "blog" | "contact" | "customizations" | "consultation" | "slots" | "bookings" | "leads" | "testimonials" | "faqs" | "resources" | "case_studies" | "analytics";

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const tabGroups: { label: string; tabs: { id: Tab; label: string; icon: typeof Home }[] }[] = [
    {
      label: "Overview",
      tabs: [
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "leads", label: "Leads", icon: Inbox },
        { id: "bookings", label: "Bookings", icon: ClipboardList },
      ],
    },
    {
      label: "Site Content",
      tabs: [
        { id: "hero", label: "Hero", icon: Home },
        { id: "about", label: "About", icon: FileText },
        { id: "skills", label: "Skills", icon: GraduationCap },
        { id: "brands", label: "Brands", icon: Building2 },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "contact", label: "Contact", icon: MessageSquare },
      ],
    },
    {
      label: "Publishing",
      tabs: [
        { id: "blog", label: "Blog", icon: PenSquare },
        { id: "case_studies", label: "Case Studies", icon: Trophy },
        { id: "testimonials", label: "Testimonials", icon: Quote },
        { id: "faqs", label: "FAQs", icon: HelpCircle },
        { id: "resources", label: "Resources", icon: Download },
      ],
    },
    {
      label: "Consultation",
      tabs: [
        { id: "consultation", label: "Content", icon: Rocket },
        { id: "slots", label: "Slots", icon: Calendar },
      ],
    },
    {
      label: "Settings",
      tabs: [
        { id: "customizations", label: "Customize", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="font-display text-xl font-bold text-foreground">
              HAB<span className="text-gradient">.</span>
            </a>
            <span className="text-muted-foreground text-sm font-body">/ Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              View Site
            </a>
            <button
              onClick={handleSignOut}
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Grouped tabs */}
        <div className="space-y-4 mb-8">
          {tabGroups.map((group) => (
            <div key={group.label}>
              <div className="text-[11px] font-body font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-body text-sm flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-crystal"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
          {activeTab === "hero" && <HeroEditor />}
          {activeTab === "about" && <AboutEditor />}
          {activeTab === "skills" && <SkillsEditor />}
          {activeTab === "brands" && <BrandsEditor />}
          {activeTab === "experience" && <ExperienceEditor />}
          {activeTab === "education" && <EducationEditor />}
          {activeTab === "blog" && <BlogEditor />}
          {activeTab === "contact" && <ContactEditor />}
          {activeTab === "consultation" && (
            <div className="space-y-8">
              <ConsultationContentEditor />
              <hr className="border-border" />
              <ConsultationProjectsEditor />
              <hr className="border-border" />
              <ConsultationReviewsEditor />
            </div>
          )}
          {activeTab === "slots" && <ConsultationSlotsEditor />}
          {activeTab === "bookings" && <ConsultationBookingsManager />}
          {activeTab === "leads" && <AuditRequestsManager />}
          {activeTab === "testimonials" && <TestimonialsEditor />}
          {activeTab === "faqs" && <FaqsEditor />}
          {activeTab === "resources" && <ResourcesEditor />}
          {activeTab === "case_studies" && <CaseStudiesEditor />}
          {activeTab === "customizations" && <CustomizationsEditor />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
