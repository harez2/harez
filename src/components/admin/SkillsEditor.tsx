import { useState } from "react";
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, Skill } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, X, icons } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common icons for skills - subset of lucide icons
const COMMON_ICONS = [
  "target", "trending-up", "bar-chart-3", "search", "mail", "users",
  "facebook", "chrome", "video", "shopping-cart", "megaphone", "zap",
  "globe", "link", "share-2", "mouse-pointer-click", "dollar-sign",
  "pie-chart", "line-chart", "activity", "gauge", "tag", "layers",
  "git-branch", "code", "database", "server", "cloud", "smartphone",
  "monitor", "palette", "pen-tool", "image", "file-text", "calendar",
  "clock", "map-pin", "heart", "star", "award", "briefcase",
  "lightbulb", "rocket", "settings", "shield", "lock", "key",
] as const;

const SkillsEditor = () => {
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "", icon: "", display_order: 0 });

  const handleCreate = async () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createSkill.mutateAsync({
        name: newSkill.name,
        category: newSkill.category,
        icon: newSkill.icon || null,
        display_order: skills?.length ?? 0,
      });
      toast.success("Skill added!");
      setNewSkill({ name: "", category: "", icon: "", display_order: 0 });
      setShowAddForm(false);
    } catch (error) {
      toast.error("Failed to add skill");
    }
  };

  const handleStartEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditingSkill(skill);
  };

  const handleUpdate = async () => {
    if (!editingId || !editingSkill.name?.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      await updateSkill.mutateAsync({
        id: editingId,
        name: editingSkill.name,
        category: editingSkill.category,
        icon: editingSkill.icon || null,
      });
      toast.success("Skill updated!");
      setEditingId(null);
      setEditingSkill({});
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

  const renderIcon = (iconName: string | null | undefined) => {
    if (!iconName) return null;
    const pascalName = iconName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    const IconComponent = icons[pascalName as keyof typeof icons];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
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
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs mb-1.5 block">Skill Name</Label>
              <Input
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g., Facebook Ads"
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Category</Label>
              <Input
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                placeholder="e.g., Advertising Platforms"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Icon (optional)</Label>
              <Select
                value={newSkill.icon}
                onValueChange={(value) => setNewSkill({ ...newSkill, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon">
                    {newSkill.icon && (
                      <span className="flex items-center gap-2">
                        {renderIcon(newSkill.icon)}
                        {newSkill.icon}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="">None</SelectItem>
                  {COMMON_ICONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <span className="flex items-center gap-2">
                        {renderIcon(icon)}
                        {icon}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                      <div>
                        <Label className="text-xs mb-1 block">Name</Label>
                        <Input
                          value={editingSkill.name || ""}
                          onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                          autoFocus
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Icon</Label>
                        <Select
                          value={editingSkill.icon || ""}
                          onValueChange={(value) => setEditingSkill({ ...editingSkill, icon: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon">
                              {editingSkill.icon && (
                                <span className="flex items-center gap-2">
                                  {renderIcon(editingSkill.icon)}
                                  {editingSkill.icon}
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="">None</SelectItem>
                            {COMMON_ICONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                <span className="flex items-center gap-2">
                                  {renderIcon(icon)}
                                  {icon}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          disabled={updateSkill.isPending}
                          className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg flex items-center gap-1"
                        >
                          {updateSkill.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingSkill({});
                          }}
                          className="px-3 py-2 bg-secondary text-foreground text-sm rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span
                        className="font-body text-sm text-foreground cursor-pointer hover:text-primary flex items-center gap-2"
                        onClick={() => handleStartEdit(skill)}
                      >
                        {skill.icon && renderIcon(skill.icon)}
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
