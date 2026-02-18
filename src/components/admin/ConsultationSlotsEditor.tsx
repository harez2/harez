import { useState } from "react";
import { format } from "date-fns";
import { useConsultationSlots, useCreateConsultationSlot, useUpdateConsultationSlot, useDeleteConsultationSlot } from "@/hooks/useConsultation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, X, Clock, Zap } from "lucide-react";

const QUICK_SLOTS_30 = [
  { start: "09:00", end: "09:30" }, { start: "09:30", end: "10:00" },
  { start: "10:00", end: "10:30" }, { start: "10:30", end: "11:00" },
  { start: "11:00", end: "11:30" }, { start: "11:30", end: "12:00" },
  { start: "12:00", end: "12:30" }, { start: "12:30", end: "13:00" },
  { start: "14:00", end: "14:30" }, { start: "14:30", end: "15:00" },
  { start: "15:00", end: "15:30" }, { start: "15:30", end: "16:00" },
  { start: "16:00", end: "16:30" }, { start: "16:30", end: "17:00" },
  { start: "17:00", end: "17:30" }, { start: "17:30", end: "18:00" },
];

const QUICK_SLOTS_60 = [
  { start: "09:00", end: "10:00" }, { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" }, { start: "12:00", end: "13:00" },
  { start: "14:00", end: "15:00" }, { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" }, { start: "17:00", end: "18:00" },
];

const ConsultationSlotsEditor = () => {
  const { data: slots, isLoading } = useConsultationSlots(false);
  const createSlot = useCreateConsultationSlot();
  const updateSlot = useUpdateConsultationSlot();
  const deleteSlot = useDeleteConsultationSlot();
  const [showAdd, setShowAdd] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [quickDate, setQuickDate] = useState("");
  const [quickDuration, setQuickDuration] = useState<"30" | "60">("30");
  const [selectedQuickSlots, setSelectedQuickSlots] = useState<Set<string>>(new Set());
  const [generatingSlots, setGeneratingSlots] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: "", start_time: "", end_time: "", is_available: true });

  const quickSlots = quickDuration === "30" ? QUICK_SLOTS_30 : QUICK_SLOTS_60;

  const toggleQuickSlot = (key: string) => {
    setSelectedQuickSlots(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const selectAllQuickSlots = () => {
    setSelectedQuickSlots(new Set(quickSlots.map(s => `${s.start}-${s.end}`)));
  };

  const deselectAllQuickSlots = () => setSelectedQuickSlots(new Set());

  const existingSlotsForDate = (slots || []).filter(s => s.date === quickDate);

  const isSlotExisting = (start: string, end: string) =>
    existingSlotsForDate.some(s => s.start_time.slice(0, 5) === start && s.end_time.slice(0, 5) === end);

  const handleGenerateSlots = async () => {
    if (!quickDate) { toast.error("Select a date first"); return; }
    if (selectedQuickSlots.size === 0) { toast.error("Select at least one time slot"); return; }
    setGeneratingSlots(true);
    let created = 0;
    let skipped = 0;
    for (const key of selectedQuickSlots) {
      const [start, end] = key.split("-");
      if (isSlotExisting(start, end)) { skipped++; continue; }
      try {
        await createSlot.mutateAsync({ date: quickDate, start_time: start, end_time: end, is_available: true });
        created++;
      } catch { /* skip failures */ }
    }
    setGeneratingSlots(false);
    toast.success(`Created ${created} slot(s)${skipped ? `, ${skipped} already existed` : ""}`);
    setSelectedQuickSlots(new Set());
    setShowQuick(false);
  };

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
        <div className="flex gap-2">
          <button onClick={() => { setShowQuick(true); setShowAdd(false); }} className="px-4 py-2 bg-secondary text-foreground font-body text-sm rounded-lg flex items-center gap-2 border border-border hover:bg-secondary/80">
            <Zap className="w-4 h-4" /> Quick Generate
          </button>
          <button onClick={() => { setShowAdd(true); setShowQuick(false); }} className="px-4 py-2 bg-gradient-crystal text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Slot
          </button>
        </div>
      </div>

      {showQuick && (
        <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-foreground">Quick Generate Slots</h3>
            <button onClick={() => setShowQuick(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Date</label>
              <input type="date" value={quickDate} onChange={(e) => setQuickDate(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Duration</label>
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button onClick={() => { setQuickDuration("30"); setSelectedQuickSlots(new Set()); }}
                  className={`px-3 py-2 font-body text-sm flex items-center gap-1 ${quickDuration === "30" ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-secondary"}`}>
                  <Clock className="w-3.5 h-3.5" /> 30 min
                </button>
                <button onClick={() => { setQuickDuration("60"); setSelectedQuickSlots(new Set()); }}
                  className={`px-3 py-2 font-body text-sm flex items-center gap-1 ${quickDuration === "60" ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-secondary"}`}>
                  <Clock className="w-3.5 h-3.5" /> 1 hour
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={selectAllQuickSlots} className="px-3 py-2 font-body text-xs text-primary hover:underline">Select All</button>
              <button onClick={deselectAllQuickSlots} className="px-3 py-2 font-body text-xs text-muted-foreground hover:underline">Deselect All</button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {quickSlots.map(({ start, end }) => {
              const key = `${start}-${end}`;
              const exists = quickDate ? isSlotExisting(start, end) : false;
              const selected = selectedQuickSlots.has(key);
              return (
                <button key={key} onClick={() => !exists && toggleQuickSlot(key)} disabled={exists}
                  className={`px-2 py-2 rounded-lg border font-body text-xs text-center transition-colors ${
                    exists ? "border-border bg-muted text-muted-foreground cursor-not-allowed line-through" :
                    selected ? "border-primary bg-primary/10 text-primary" :
                    "border-border bg-background text-foreground hover:border-primary/50"
                  }`}>
                  {start} - {end}
                </button>
              );
            })}
          </div>

          <button onClick={handleGenerateSlots} disabled={generatingSlots || selectedQuickSlots.size === 0}
            className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
            {generatingSlots ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Generate {selectedQuickSlots.size} Slot{selectedQuickSlots.size !== 1 ? "s" : ""}
          </button>
        </div>
      )}

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
