import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Harez Albaki | Creative Developer & Designer</title>
        <meta
          name="description"
          content="Harez Albaki is a creative developer and designer crafting digital experiences that blend aesthetics with functionality. View portfolio and get in touch."
        />
        <meta name="keywords" content="developer, designer, portfolio, web development, UI/UX, React, frontend" />
        <link rel="canonical" href="https://harezalbaki.com" />
      </Helmet>
      
      <main className="overflow-hidden">
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
};

export default Index;
