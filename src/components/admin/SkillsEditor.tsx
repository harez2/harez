import { useState } from "react";
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, Skill } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, X } from "lucide-react";

const SkillsEditor = () => {
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "", display_order: 0 });

  const handleCreate = async () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createSkill.mutateAsync({
        name: newSkill.name,
        category: newSkill.category,
        display_order: skills?.length ?? 0,
      });
      toast.success("Skill added!");
      setNewSkill({ name: "", category: "", display_order: 0 });
      setShowAddForm(false);
    } catch (error) {
      toast.error("Failed to add skill");
    }
  };

  const handleUpdate = async (skill: Skill) => {
    try {
      await updateSkill.mutateAsync(skill);
      toast.success("Skill updated!");
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to update skill");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await deleteSkill.mutateAsync(id);
      toast.success("Skill deleted!");
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const categories = [...new Set(skills?.map((s) => s.category) ?? [])];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Skills</h2>
          <p className="font-body text-sm text-muted-foreground">
            Manage your skills and categories.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-crystal text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-foreground">Add New Skill</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Skill name"
            />
            <input
              type="text"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Category"
              list="categories"
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <button
            onClick={handleCreate}
            disabled={createSkill.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {createSkill.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Skill
          </button>
        </div>
      )}

      {/* Skills by Category */}
      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {category}
          </h3>
          <div className="space-y-2">
            {skills
              ?.filter((s) => s.category === category)
              .map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between bg-secondary/30 border border-border rounded-lg px-4 py-3"
                >
                  {editingId === skill.id ? (
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="text"
                        defaultValue={skill.name}
                        onBlur={(e) =>
                          handleUpdate({ ...skill, name: e.target.value })
                        }
                        className="flex-1 px-2 py-1 bg-background border border-border rounded font-body text-sm text-foreground focus:outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="font-body text-sm text-foreground cursor-pointer hover:text-primary"
                        onClick={() => setEditingId(skill.id)}
                      >
                        {skill.name}
                      </span>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsEditor;
