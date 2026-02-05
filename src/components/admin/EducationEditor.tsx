import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
  Education,
} from "@/hooks/useSiteContent";

const EducationEditor = () => {
  const { data: education, isLoading } = useEducation();
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData(edu);
  };

  const handleSave = async () => {
    if (!editingId || !formData.degree || !formData.institution || !formData.period) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateEducation.mutateAsync({
        id: editingId,
        degree: formData.degree,
        institution: formData.institution,
        period: formData.period,
        display_order: formData.display_order ?? 0,
      });
      toast.success("Education updated successfully");
      setEditingId(null);
      setFormData({});
    } catch (error) {
      toast.error("Failed to update education");
    }
  };

  const handleAdd = async () => {
    const newOrder = education?.length ?? 0;
    try {
      await createEducation.mutateAsync({
        degree: "New Degree",
        institution: "Institution Name",
        period: "20XX",
        display_order: newOrder,
      });
      toast.success("Education added successfully");
    } catch (error) {
      toast.error("Failed to add education");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await deleteEducation.mutateAsync(id);
      toast.success("Education deleted successfully");
    } catch (error) {
      toast.error("Failed to delete education");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Education</h2>
          <p className="font-body text-muted-foreground mt-1">
            Manage your education background
          </p>
        </div>
        <Button onClick={handleAdd} disabled={createEducation.isPending}>
          {createEducation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {education?.map((edu) => (
          <div
            key={edu.id}
            className="bg-secondary/50 border border-border rounded-xl p-4"
          >
            {editingId === edu.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Degree / Certification</Label>
                    <Input
                      value={formData.degree || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, degree: e.target.value })
                      }
                      placeholder="e.g., MBA in Marketing"
                    />
                  </div>
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={formData.institution || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, institution: e.target.value })
                      }
                      placeholder="e.g., Harvard University"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Period</Label>
                    <Input
                      value={formData.period || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, period: e.target.value })
                      }
                      placeholder="e.g., 2020 - 2022"
                    />
                  </div>
                  <div>
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={formData.display_order ?? 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_order: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateEducation.isPending}>
                    {updateEducation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-grab" />
                  <div>
                    <h4 className="font-display font-semibold text-foreground">
                      {edu.degree}
                    </h4>
                    <p className="font-body text-sm text-primary">{edu.institution}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {edu.period}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(edu.id)}
                    disabled={deleteEducation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {education?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No education entries yet. Click "Add Education" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationEditor;
