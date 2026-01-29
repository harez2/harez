import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Upload,
  ExternalLink,
  FileText,
  Briefcase,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useAdminBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  BlogPost,
  BlogPostInsert,
  generateSlug,
} from "@/hooks/useBlogPosts";
import { uploadImage } from "@/hooks/useSiteContent";
import { format } from "date-fns";

type EditorMode = "list" | "create" | "edit";

const BlogEditor = () => {
  const { data: posts, isLoading } = useAdminBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [mode, setMode] = useState<EditorMode>("list");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<any>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<BlogPostInsert>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category: "blog",
    status: "draft",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    published_at: null,
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "blog",
      status: "draft",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      published_at: null,
      display_order: 0,
    });
    setEditingPost(null);
    setMode("list");
  };

  const handleCreate = () => {
    // Reset form data first, then set mode to create
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "blog",
      status: "draft",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      published_at: null,
      display_order: 0,
    });
    setEditingPost(null);
    setMode("create");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      featured_image: post.featured_image || "",
      category: post.category,
      status: post.status,
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      meta_keywords: post.meta_keywords || "",
      published_at: post.published_at,
      display_order: post.display_order,
    });
    setMode("edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: mode === "create" ? generateSlug(title) : formData.slug,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const path = `blog/${Date.now()}-${file.name}`;
      const url = await uploadImage(file, path);
      setFormData({ ...formData, featured_image: url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required");
      return;
    }

    try {
      if (mode === "create") {
        const postData: BlogPostInsert = {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content || null,
          featured_image: formData.featured_image || null,
          category: formData.category || "blog",
          status: formData.status || "draft",
          meta_title: formData.meta_title || null,
          meta_description: formData.meta_description || null,
          meta_keywords: formData.meta_keywords || null,
          published_at:
            formData.status === "published"
              ? formData.published_at || new Date().toISOString()
              : null,
          display_order: formData.display_order || 0,
        };
        await createPost.mutateAsync(postData);
        toast.success("Post created successfully");
      } else if (mode === "edit" && editingPost) {
        await updatePost.mutateAsync({
          id: editingPost.id,
          ...formData,
          published_at:
            formData.status === "published"
              ? formData.published_at || new Date().toISOString()
              : null,
        });
        toast.success("Post updated successfully");
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save post");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // List View
  if (mode === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Blog Posts
          </h2>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {post.category === "case_study" ? (
                          <Briefcase className="w-6 h-6 text-muted-foreground" />
                        ) : (
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.category === "case_study" ? "Case Study" : "Blog"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(post.created_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary/30 rounded-xl border border-border">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No posts yet
            </h3>
            <p className="font-body text-muted-foreground mb-4">
              Create your first blog post or case study
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Post
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Create/Edit Form
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {mode === "create" ? "New Post" : "Edit Post"}
        </h2>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={resetForm}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={createPost.isPending || updatePost.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {createPost.isPending || updatePost.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              className="text-lg"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="post-url-slug"
            />
            <p className="text-xs text-muted-foreground">
              URL: /blog/{formData.slug || "your-post-slug"}
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ""}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary for listings..."
              rows={3}
            />
          </div>

          {/* Content - TinyMCE Editor */}
          <div className="space-y-2">
            <Label>Content</Label>
            <div className="border border-border rounded-lg overflow-hidden">
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={formData.content || ""}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "link image media | removeformat | code | help",
                  content_style:
                    "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 16px; line-height: 1.6; }",
                  skin: "oxide",
                  content_css: "default",
                  branding: false,
                  promotion: false,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Use the toolbar above to format your content with headings, lists, images, and more.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Category */}
          <div className="p-4 bg-secondary/50 rounded-xl border border-border space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Publishing
            </h3>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: "draft" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.status === "draft"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: "published" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.status === "published"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, category: "blog" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    formData.category === "blog"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Blog
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, category: "case_study" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    formData.category === "case_study"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Case Study
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="p-4 bg-secondary/50 rounded-xl border border-border space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Featured Image
            </h3>

            {formData.featured_image ? (
              <div className="space-y-2">
                <img
                  src={formData.featured_image}
                  alt="Featured"
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, featured_image: "" })}
                  className="w-full"
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* SEO Settings */}
          <div className="p-4 bg-secondary/50 rounded-xl border border-border space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              SEO Settings
            </h3>

            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meta_title: e.target.value })
                }
                placeholder="Custom SEO title (optional)"
              />
              <p className="text-xs text-muted-foreground">
                {(formData.meta_title || formData.title || "").length}/60 chars
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description: e.target.value })
                }
                placeholder="Custom SEO description (optional)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {(formData.meta_description || "").length}/160 chars
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={formData.meta_keywords || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meta_keywords: e.target.value })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogEditor;
