import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, LogOut, Home, FileText, Briefcase, GraduationCap, MessageSquare, Building2, PenSquare, Settings } from "lucide-react";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import SkillsEditor from "@/components/admin/SkillsEditor";
import ExperienceEditor from "@/components/admin/ExperienceEditor";
import EducationEditor from "@/components/admin/EducationEditor";
import ContactEditor from "@/components/admin/ContactEditor";
import BrandsEditor from "@/components/admin/BrandsEditor";
import BlogEditor from "@/components/admin/BlogEditor";
import CustomizationsEditor from "@/components/admin/CustomizationsEditor";

type Tab = "hero" | "about" | "skills" | "brands" | "experience" | "education" | "blog" | "contact" | "customizations";

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

  const tabs = [
    { id: "hero" as Tab, label: "Hero", icon: Home },
    { id: "about" as Tab, label: "About", icon: FileText },
    { id: "skills" as Tab, label: "Skills", icon: GraduationCap },
    { id: "brands" as Tab, label: "Brands", icon: Building2 },
    { id: "experience" as Tab, label: "Experience", icon: Briefcase },
    { id: "education" as Tab, label: "Education", icon: GraduationCap },
    { id: "blog" as Tab, label: "Blog", icon: PenSquare },
    { id: "contact" as Tab, label: "Contact", icon: MessageSquare },
    { id: "customizations" as Tab, label: "Customize", icon: Settings },
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
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
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
          {activeTab === "customizations" && <CustomizationsEditor />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
