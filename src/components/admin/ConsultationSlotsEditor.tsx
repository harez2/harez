import { useState } from "react";
import { format } from "date-fns";
import { useConsultationSlots, useCreateConsultationSlot, useUpdateConsultationSlot, useDeleteConsultationSlot } from "@/hooks/useConsultation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, X } from "lucide-react";

const ConsultationSlotsEditor = () => {
  const { data: slots, isLoading } = useConsultationSlots(false);
  const createSlot = useCreateConsultationSlot();
  const updateSlot = useUpdateConsultationSlot();
  const deleteSlot = useDeleteConsultationSlot();
  const [showAdd, setShowAdd] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: "", start_time: "", end_time: "", is_available: true });

  const handleCreate = async () => {
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time) { toast.error("Fill all fields"); return; }
    try {
      await createSlot.mutateAsync(newSlot);
      toast.success("Slot added!");
      setNewSlot({ date: "", start_time: "", end_time: "", is_available: true });
      setShowAdd(false);
    } catch { toast.error("Failed to add slot"); }
  };

  const toggleAvailability = async (slot: any) => {
    try {
      await updateSlot.mutateAsync({ ...slot, is_available: !slot.is_available });
      toast.success("Updated!");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot?")) return;
    try { await deleteSlot.mutateAsync(id); toast.success("Deleted!"); } catch { toast.error("Failed"); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  // Group slots by date
  const grouped = (slots || []).reduce((acc: Record<string, any[]>, slot) => {
    (acc[slot.date] = acc[slot.date] || []).push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Time Slots</h2>
          <p className="font-body text-sm text-muted-foreground">Manage available booking time slots.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-gradient-crystal text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Slot
        </button>
      </div>

      {showAdd && (
        <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-foreground">Add New Slot</h3>
            <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Date</label>
              <input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Start Time</label>
              <input type="time" value={newSlot.start_time} onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">End Time</label>
              <input type="time" value={newSlot.end_time} onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
          <button onClick={handleCreate} disabled={createSlot.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
            {createSlot.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).sort().map(([date, dateSlots]) => (
          <div key={date}>
            <h3 className="font-display text-sm font-semibold text-foreground mb-2">{format(new Date(date + "T00:00:00"), "EEEE, MMM d, yyyy")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {(dateSlots as any[]).map((slot) => (
                <div key={slot.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${slot.is_available ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/30 opacity-60"}`}>
                  <button onClick={() => toggleAvailability(slot)} className="font-body text-foreground flex-1 text-left">
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    <span className={`ml-2 text-xs ${slot.is_available ? "text-primary" : "text-muted-foreground"}`}>
                      {slot.is_available ? "Available" : "Booked"}
                    </span>
                  </button>
                  <button onClick={() => handleDelete(slot.id)} className="text-muted-foreground hover:text-destructive ml-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="font-body text-sm text-muted-foreground text-center py-8">No slots created yet. Add your first available slot above.</p>
        )}
      </div>
    </div>
  );
};

export default ConsultationSlotsEditor;
