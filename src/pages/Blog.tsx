import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import SEO from "@/components/SEO";
import BlogCard from "@/components/BlogCard";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

type FilterCategory = "all" | "blog" | "case_study";

const Blog = () => {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const { data: allPosts, isLoading } = useBlogPosts();

  const filteredPosts =
    filter === "all"
      ? allPosts
      : allPosts?.filter((post) => post.category === filter);

  const filters: { id: FilterCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "blog", label: "Blogs" },
    { id: "case_study", label: "Case Studies" },
  ];

  return (
    <>
      <SEO
        title="Blog & Case Studies | Md Harez Al Baki"
        description="Read the latest insights, tips, and case studies on digital marketing, Facebook Ads, Google Ads, and lead generation strategies."
        keywords="digital marketing blog, case studies, facebook ads tips, google ads, lead generation"
        url="/blog"
      />

      <Navigation />

      <main className="pt-24 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-6">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-body text-sm font-medium rounded-full mb-4">
                Blog & Case Studies
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Insights & Success Stories
              </h1>
              <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
                Discover digital marketing strategies, industry insights, and real
                client success stories that drive results.
              </p>
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={0.1}>
            <div className="flex justify-center gap-2 mb-12">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-5 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                    filter === f.id
                      ? "bg-primary text-primary-foreground shadow-crystal"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-20" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <ScrollReveal key={post.id} delay={index * 0.05}>
                  <BlogCard post={post} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-body text-muted-foreground text-lg">
                No articles published yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
