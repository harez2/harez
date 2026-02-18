import { useState } from "react";
import { useConsultationProjects, useCreateConsultationProject, useUpdateConsultationProject, useDeleteConsultationProject } from "@/hooks/useConsultation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import type { ConsultationProject } from "@/hooks/useConsultation";

const ConsultationProjectsEditor = () => {
  const { data: projects, isLoading } = useConsultationProjects();
  const createProject = useCreateConsultationProject();
  const updateProject = useUpdateConsultationProject();
  const deleteProject = useDeleteConsultationProject();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ConsultationProject>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", image_url: "", link: "", display_order: 0 });

  const handleCreate = async () => {
    if (!newProject.title.trim()) { toast.error("Title is required"); return; }
    try {
      await createProject.mutateAsync({ ...newProject, display_order: projects?.length ?? 0, image_url: newProject.image_url || null, link: newProject.link || null });
      toast.success("Project added!");
      setNewProject({ title: "", description: "", image_url: "", link: "", display_order: 0 });
      setShowAdd(false);
    } catch { toast.error("Failed to add project"); }
  };

  const handleUpdate = async (project: ConsultationProject) => {
    try {
      await updateProject.mutateAsync({ ...project, ...editData });
      toast.success("Updated!"); setExpandedId(null); setEditData({});
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try { await deleteProject.mutateAsync(id); toast.success("Deleted!"); } catch { toast.error("Failed to delete"); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Projects Showcase</h2>
          <p className="font-body text-sm text-muted-foreground">Manage projects displayed on the consultation page.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-gradient-crystal text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {showAdd && (
        <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-foreground">Add New Project</h3>
            <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" placeholder="Title *" />
          <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" placeholder="Description" rows={2} />
          <input type="url" value={newProject.image_url} onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" placeholder="Image URL" />
          <input type="url" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" placeholder="Project Link" />
          <button onClick={handleCreate} disabled={createProject.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
            {createProject.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      )}

      <div className="space-y-3">
        {projects?.map((project) => (
          <div key={project.id} className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}>
              <h4 className="font-display text-sm font-semibold text-foreground">{project.title}</h4>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                {expandedId === project.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>
            {expandedId === project.id && (
              <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                <input type="text" defaultValue={project.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Title" />
                <textarea defaultValue={project.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary resize-none" rows={2} />
                <input type="url" defaultValue={project.image_url || ""} onChange={(e) => setEditData({ ...editData, image_url: e.target.value || null })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Image URL" />
                <input type="url" defaultValue={project.link || ""} onChange={(e) => setEditData({ ...editData, link: e.target.value || null })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Link" />
                <button onClick={() => handleUpdate(project)} disabled={updateProject.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
                  {updateProject.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultationProjectsEditor;
