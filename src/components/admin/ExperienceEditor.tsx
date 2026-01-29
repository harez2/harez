import { useState } from "react";
import { useExperience, useCreateExperience, useUpdateExperience, useDeleteExperience, Experience } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";

const ExperienceEditor = () => {
  const { data: experiences, isLoading } = useExperience();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editData, setEditData] = useState<Partial<Experience>>({});
  const [newExp, setNewExp] = useState<Omit<Experience, "id">>({
    company: "",
    role: "",
    period: "",
    description: "",
    achievements: [],
    display_order: 0,
  });
  const [newAchievement, setNewAchievement] = useState("");

  const handleCreate = async () => {
    if (!newExp.company.trim() || !newExp.role.trim() || !newExp.period.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createExperience.mutateAsync({
        ...newExp,
        display_order: experiences?.length ?? 0,
      });
      toast.success("Experience added!");
      setNewExp({ company: "", role: "", period: "", description: "", achievements: [], display_order: 0 });
      setShowAddForm(false);
    } catch (error) {
      toast.error("Failed to add experience");
    }
  };

  const handleUpdate = async (exp: Experience) => {
    try {
      await updateExperience.mutateAsync({ ...exp, ...editData });
      toast.success("Experience updated!");
      setExpandedId(null);
      setEditData({});
    } catch (error) {
      toast.error("Failed to update experience");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      await deleteExperience.mutateAsync(id);
      toast.success("Experience deleted!");
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  const addAchievementToNew = () => {
    if (newAchievement.trim()) {
      setNewExp({ ...newExp, achievements: [...newExp.achievements, newAchievement.trim()] });
      setNewAchievement("");
    }
  };

  const removeAchievementFromNew = (index: number) => {
    setNewExp({ ...newExp, achievements: newExp.achievements.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Experience</h2>
          <p className="font-body text-sm text-muted-foreground">
            Manage your work experience entries.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-crystal text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-foreground">Add New Experience</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Job Title *"
            />
            <input
              type="text"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Company *"
            />
            <input
              type="text"
              value={newExp.period}
              onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Period (e.g., Jan 2023 - Present) *"
            />
          </div>
          <textarea
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            placeholder="Description"
            rows={2}
          />
          
          {/* Achievements */}
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-2">Achievements</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievementToNew())}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Add an achievement"
              />
              <button
                onClick={addAchievementToNew}
                className="px-3 py-2 bg-secondary text-foreground rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {newExp.achievements.map((ach, i) => (
                <div key={i} className="flex items-center justify-between bg-background px-3 py-2 rounded-lg text-sm">
                  <span className="text-foreground">{ach}</span>
                  <button onClick={() => removeAchievementFromNew(i)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={createExperience.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {createExperience.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Experience
          </button>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-3">
        {experiences?.map((exp) => (
          <div key={exp.id} className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <div>
                <h4 className="font-display text-sm font-semibold text-foreground">{exp.role}</h4>
                <p className="font-body text-xs text-muted-foreground">
                  {exp.company} • {exp.period}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(exp.id);
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedId === exp.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedId === exp.id && (
              <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    defaultValue={exp.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    defaultValue={exp.company}
                    onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    defaultValue={exp.period}
                    onChange={(e) => setEditData({ ...editData, period: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="Period"
                  />
                </div>
                <textarea
                  defaultValue={exp.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                  placeholder="Description"
                  rows={2}
                />
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-2">
                    Achievements: {exp.achievements.join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => handleUpdate(exp)}
                  disabled={updateExperience.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70"
                >
                  {updateExperience.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceEditor;
