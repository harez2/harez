import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCard from "./BlogCard";
import ScrollReveal from "./ScrollReveal";

const BlogPreview = () => {
  const { data: posts, isLoading } = useBlogPosts();

  // Show only latest 3 posts
  const latestPosts = posts?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Latest Articles
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and case studies from my digital marketing journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    );
  }

  // Don't render section if no published posts
  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-body text-sm font-medium rounded-full mb-4">
              Blog & Case Studies
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Latest Articles
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and case studies from my digital marketing journey
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 0.1}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-lg shadow-soft hover:shadow-crystal transition-all"
            >
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BlogPreview;
