import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Brands from "@/components/Brands";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Md Harez Al Baki | Digital Marketing Manager</title>
        <meta
          name="description"
          content="Md Harez Al Baki is a Digital Marketing Manager with 5+ years experience in media buying, lead generation, and growth marketing. Specializing in Facebook Ads, Google Ads, and data-driven campaigns."
        />
        <meta name="keywords" content="digital marketing, performance marketing, media buyer, Facebook ads, Google ads, lead generation, growth marketing, Dhaka, Bangladesh" />
        <link rel="canonical" href="https://harezalbaki.com" />
      </Helmet>
      
      <main className="overflow-hidden">
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Brands />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </>
  );
};

export default Index;
