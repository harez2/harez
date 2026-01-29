import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { BlogPost } from "@/hooks/useBlogPosts";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "MMM dd, yyyy")
    : format(new Date(post.created_at), "MMM dd, yyyy");

  const categoryLabel = post.category === "case_study" ? "Case Study" : "Blog";

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-crystal transition-all duration-300"
    >
      {/* Featured Image */}
      <div className="aspect-video overflow-hidden bg-muted">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-crystal opacity-20">
            <span className="text-4xl font-display font-bold text-primary">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-xs font-body font-medium bg-primary/10 text-primary rounded-full mb-3">
          {categoryLabel}
        </span>

        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="font-body text-muted-foreground text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="w-4 h-4" />
            <span className="font-body">{publishedDate}</span>
          </div>
          <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
            Read more
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
