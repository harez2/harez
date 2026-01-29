import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import ScrollReveal from "@/components/ScrollReveal";
import { format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  const { data: allPosts } = useBlogPosts();

  // Get related posts (same category, excluding current)
  const relatedPosts = allPosts
    ?.filter((p) => p.category === post?.category && p.id !== post?.id)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt || "",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-20 min-h-screen bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="aspect-video bg-muted rounded-2xl" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-20 min-h-screen bg-background">
          <div className="container mx-auto px-6 text-center py-20">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "MMMM dd, yyyy")
    : format(new Date(post.created_at), "MMMM dd, yyyy");

  const categoryLabel = post.category === "case_study" ? "Case Study" : "Blog";

  return (
    <>
      <SEO
        title={post.meta_title || `${post.title} | Md Harez Al Baki`}
        description={post.meta_description || post.excerpt || undefined}
        keywords={post.meta_keywords || undefined}
        image={post.featured_image || undefined}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.published_at || post.created_at}
        modifiedTime={post.updated_at}
      />

      <Navigation />

      <main className="pt-24 pb-20 min-h-screen bg-background">
        <article className="container mx-auto px-6 max-w-4xl">
          {/* Back Link */}
          <ScrollReveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </ScrollReveal>

          {/* Header */}
          <ScrollReveal delay={0.1}>
            <header className="mb-8">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 text-xs font-body font-medium bg-primary/10 text-primary rounded-full mb-4">
                {categoryLabel}
              </span>

              {/* Title */}
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground mb-6">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-body text-sm">{publishedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="font-body text-sm">{categoryLabel}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-body text-sm">Share</span>
                </button>
              </div>
            </header>
          </ScrollReveal>

          {/* Featured Image */}
          {post.featured_image && (
            <ScrollReveal delay={0.2}>
              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          )}

          {/* Content */}
          <ScrollReveal delay={0.3}>
            <div
              className="prose prose-lg max-w-none font-body text-foreground
                prose-headings:font-display prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </ScrollReveal>

          {/* Author Section */}
          <ScrollReveal delay={0.4}>
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-crystal flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-primary-foreground">
                    H
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Md Harez Al Baki
                  </h3>
                  <p className="font-body text-muted-foreground text-sm">
                    Digital Marketing Manager
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </article>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="container mx-auto px-6 mt-20">
            <ScrollReveal>
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                Related Articles
              </h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <ScrollReveal key={relatedPost.id} delay={index * 0.1}>
                  <BlogCard post={relatedPost} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
