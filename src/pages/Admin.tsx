import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, LogOut, Home, FileText, Briefcase, GraduationCap, MessageSquare, Building2, PenSquare, Settings, Rocket, Calendar, ClipboardList, Inbox, Quote, HelpCircle, Download, Trophy, BarChart3, Hash } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
import StatsEditor from "@/components/admin/StatsEditor";

type Tab = "hero" | "stats" | "about" | "skills" | "brands" | "experience" | "education" | "blog" | "contact" | "customizations" | "consultation" | "slots" | "bookings" | "leads" | "testimonials" | "faqs" | "resources" | "case_studies" | "analytics";

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
        { id: "stats", label: "Stats", icon: Hash },
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

  const activeLabel =
    tabGroups.flatMap((g) => g.tabs).find((t) => t.id === activeTab)?.label ?? "";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarContent>
            {tabGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.tabs.map((tab) => (
                      <SidebarMenuItem key={tab.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveTab(tab.id)}
                          isActive={activeTab === tab.id}
                          tooltip={tab.label}
                        >
                          <tab.icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger />
                <a href="/" className="font-display text-xl font-bold text-foreground">
                  HAB<span className="text-gradient">.</span>
                </a>
                <span className="text-muted-foreground text-sm font-body truncate">
                  / Admin / {activeLabel}
                </span>
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

          <main className="flex-1 p-6 lg:p-8">
            <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
          {activeTab === "hero" && <HeroEditor />}
          {activeTab === "stats" && <StatsEditor />}
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
