import { useState } from "react";
import { format } from "date-fns";
import { useConsultationBookings, useUpdateConsultationBooking } from "@/hooks/useConsultation";
import { toast } from "sonner";
import { Loader2, Save, ChevronDown, ChevronUp, Filter } from "lucide-react";
import type { ConsultationBooking } from "@/hooks/useConsultation";

const statusColors: Record<string, string> = {
  pending: "bg-accent/10 text-accent",
  confirmed: "bg-primary/10 text-primary",
  completed: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

const ConsultationBookingsManager = () => {
  const { data: bookings, isLoading } = useConsultationBookings();
  const updateBooking = useUpdateConsultationBooking();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ConsultationBooking>>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBookings = statusFilter === "all" ? bookings : bookings?.filter((b) => b.status === statusFilter);

  const handleUpdate = async (booking: ConsultationBooking) => {
    try {
      await updateBooking.mutateAsync({ id: booking.id, ...editData });
      toast.success("Booking updated!"); setExpandedId(null); setEditData({});
    } catch { toast.error("Failed to update"); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Bookings</h2>
          <p className="font-body text-sm text-muted-foreground">{bookings?.length || 0} total bookings</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button key={status} onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg font-body text-xs capitalize transition-all ${statusFilter === status ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredBookings?.map((booking) => {
          const slot = booking.consultation_slots;
          return (
            <div key={booking.id} className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}>
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-display text-sm font-semibold text-foreground">{booking.client_name}</h4>
                    <p className="font-body text-xs text-muted-foreground">
                      {slot ? `${format(new Date(slot.date + "T00:00:00"), "MMM d, yyyy")} • ${slot.start_time.slice(0, 5)}` : "No slot info"} • {booking.payment_method}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body capitalize ${statusColors[booking.status] || "bg-secondary text-muted-foreground"}`}>
                    {booking.status}
                  </span>
                  {expandedId === booking.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {expandedId === booking.id && (
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 font-body text-sm">
                    <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{booking.client_email}</span></div>
                    <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{booking.client_phone}</span></div>
                    <div><span className="text-muted-foreground">Payment:</span> <span className="text-foreground capitalize">{booking.payment_method}</span></div>
                    <div><span className="text-muted-foreground">Transaction ID:</span> <span className="text-foreground font-mono">{booking.transaction_id}</span></div>
                    <div><span className="text-muted-foreground">Amount:</span> <span className="text-foreground">৳{booking.amount.toLocaleString()}</span></div>
                    <div><span className="text-muted-foreground">Booked:</span> <span className="text-foreground">{format(new Date(booking.created_at), "MMM d, yyyy h:mm a")}</span></div>
                  </div>

                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="font-body text-xs text-muted-foreground block mb-1">Status</label>
                      <select
                        defaultValue={booking.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="font-body text-xs text-muted-foreground block mb-1">Admin Notes</label>
                      <input type="text" defaultValue={booking.admin_notes || ""} onChange={(e) => setEditData({ ...editData, admin_notes: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" placeholder="Add notes..." />
                    </div>
                  </div>

                  <button onClick={() => handleUpdate(booking)} disabled={updateBooking.isPending}
                    className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg flex items-center gap-2 disabled:opacity-70">
                    {updateBooking.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Booking
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {!filteredBookings?.length && (
          <p className="font-body text-sm text-muted-foreground text-center py-8">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default ConsultationBookingsManager;
