import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Process from "@/components/Process";
import CaseStudies from "@/components/CaseStudies";
import Industries from "@/components/Industries";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import BlogPreview from "@/components/BlogPreview";
import LeadMagnet from "@/components/LeadMagnet";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgress from "@/components/ScrollProgress";
import { useCustomizationsContext } from "@/contexts/CustomizationsContext";

const Index = () => {
  const { layout } = useCustomizationsContext();

  const showHero = layout?.showHero ?? true;
  const showAbout = layout?.showAbout ?? true;
  const showSkills = layout?.showSkills ?? true;
  const showBrands = layout?.showBrands ?? true;
  const showExperience = layout?.showExperience ?? true;
  const showBlog = layout?.showBlog ?? true;
  const showContact = layout?.showContact ?? true;

  return (
    <>
      <Helmet>
        <title>Harez Al Baki — Performance Marketing Consultant & Growth Partner</title>
        <meta
          name="description"
          content="Scale your business with data-driven performance marketing. Meta Ads, Google Ads, SEO and CRO from a consultant who has managed $500K+ in ad spend across 30+ brands."
        />
        <meta name="keywords" content="performance marketing consultant, growth partner, Meta Ads, Google Ads, SEO, CRO, lead generation, Dhaka, Bangladesh" />
        <link rel="canonical" href="https://harezalbaki.com" />
        <meta property="og:title" content="Harez Al Baki — Performance Marketing Consultant" />
        <meta property="og:description" content="Scale your business with data-driven performance marketing." />
        <meta property="og:url" content="https://harezalbaki.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Md Harez Al Baki",
            url: "https://harezalbaki.com",
            jobTitle: "Performance Marketing Consultant & Growth Partner",
            description:
              "Performance marketing consultant helping ambitious brands turn ad spend into predictable revenue.",
            sameAs: ["https://twitter.com/iamharez", "https://linkedin.com/in/iamharez"],
          })}
        </script>
      </Helmet>

      <ScrollProgress />
      <Navigation />

      <main id="home" className="overflow-hidden">
        {showHero && <Hero />}
        {showBrands && <Brands />}
        <Stats />
        <Services />
        <Process />
        <CaseStudies />
        <Industries />
        {showAbout && <About />}
        {showSkills && <Skills />}
        {showExperience && <Experience />}
        <LeadMagnet />
        {showBlog && <BlogPreview />}
        {showContact && <Contact />}
        <Footer />
      </main>

      <FloatingWhatsApp />
    </>
  );
};

export default Index;
