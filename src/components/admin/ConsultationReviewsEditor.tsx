import { useState } from "react";
import { useConsultationReviews, useCreateConsultationReview, useUpdateConsultationReview, useDeleteConsultationReview } from "@/hooks/useConsultation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, X, ChevronDown, ChevronUp, Star } from "lucide-react";
import type { ConsultationReview } from "@/hooks/useConsultation";

const ConsultationReviewsEditor = () => {
  const { data: reviews, isLoading } = useConsultationReviews();
  const createReview = useCreateConsultationReview();
  const updateReview = useUpdateConsultationReview();
  const deleteReview = useDeleteConsultationReview();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ConsultationReview>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newReview, setNewReview] = useState({ client_name: "", client_company: "", client_photo: "", review_text: "", rating: 5, display_order: 0 });

  const handleCreate = async () => {
    if (!newReview.client_name.trim() || !newReview.review_text.trim()) { toast.error("Name and review are required"); return; }
    try {
      await createReview.mutateAsync({ ...newReview, display_order: reviews?.length ?? 0, client_company: newReview.client_company || null, client_photo: newReview.client_photo || null });
      toast.success("Review added!");
      setNewReview({ client_name: "", client_company: "", client_photo: "", review_text: "", rating: 5, display_order: 0 });
      setShowAdd(false);
    } catch { toast.error("Failed to add review"); }
  };

  const handleUpdate = async (review: ConsultationReview) => {
    try {
      await updateReview.mutateAsync({ ...review, ...editData });
      toast.success("Updated!"); setExpandedId(null); setEditData({});
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try { await deleteReview.mutateAsync(id); toast.success("Deleted!"); } catch { toast.error("Failed"); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Client Reviews</h2>
          <p className="font-body text-sm text-muted-foreground">Manage testimonials displayed on the consultation page.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-gradient-crystal text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {showAdd && (
        <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-foreground">Add New Review</h3>
            <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input type="text" value={newReview.client_name} onChange={(e) => setNewReview({ ...newReview, client_name: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" placeholder="Client Name *" />
            <input type="text" value={newReview.client_company} onChange={(e) => setNewReview({ ...newReview, client_company: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" placeholder="Company (optional)" />
          </div>
          <textarea value={newReview.review_text} onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" placeholder="Review text *" rows={3} />
          <div className="flex items-center gap-2">
            <span className="font-body text-sm text-muted-foreground">Rating:</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" onClick={() => setNewReview({ ...newReview, rating: r })}>
                <Star className={`w-5 h-5 ${r <= newReview.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <button onClick={handleCreate} disabled={createReview.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
            {createReview.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      )}

      <div className="space-y-3">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}>
              <div>
                <h4 className="font-display text-sm font-semibold text-foreground">{review.client_name}</h4>
                <p className="font-body text-xs text-muted-foreground">{review.client_company || "No company"}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleDelete(review.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                {expandedId === review.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>
            {expandedId === review.id && (
              <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                <input type="text" defaultValue={review.client_name} onChange={(e) => setEditData({ ...editData, client_name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Client Name" />
                <input type="text" defaultValue={review.client_company || ""} onChange={(e) => setEditData({ ...editData, client_company: e.target.value || null })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Company" />
                <textarea defaultValue={review.review_text} onChange={(e) => setEditData({ ...editData, review_text: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary resize-none" rows={3} />
                <button onClick={() => handleUpdate(review)} disabled={updateReview.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
                  {updateReview.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultationReviewsEditor;
