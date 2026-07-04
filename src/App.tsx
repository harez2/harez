import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CustomizationsProvider } from "@/contexts/CustomizationsContext";
import Index from "./pages/Index";
import { Loader2 } from "lucide-react";

const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BusinessGrowth = lazy(() => import("./pages/BusinessGrowth"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));

const RouteFallback = () => (
  <div className="min-h-dvh flex items-center justify-center bg-background">
    <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="Loading" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CustomizationsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <a href="#main-content" className="skip-to-content">
                  Skip to main content
                </a>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/business-growth" element={<BusinessGrowth />} />
                    <Route path="/services/:slug" element={<ServicePage />} />
                    <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </CustomizationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
