import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useConsultationSlots, useCreateConsultationBooking, useConsultationContent } from "@/hooks/useConsultation";
import { toast } from "sonner";

const BookingForm = () => {
  const { data: slots } = useConsultationSlots(true);
  const { data: paymentContent } = useConsultationContent("payment");
  const createBooking = useCreateConsultationBooking();

  const payment = paymentContent?.content || {};
  const sessionFee = payment.amount || 5000;
  const bkashNumber = payment.bkash_number || "01XXXXXXXXX";
  const bankDetails = payment.bank_details || "Bank Name: ...\nAccount: ...\nRouting: ...";

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "bank_transfer">("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Get unique dates that have available slots
  const availableDates = useMemo(() => {
    if (!slots) return new Set<string>();
    return new Set(slots.map((s) => s.date));
  }, [slots]);

  // Get slots for selected date
  const slotsForDate = useMemo(() => {
    if (!selectedDate || !slots) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return slots.filter((s) => s.date === dateStr);
  }, [selectedDate, slots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !name.trim() || !email.trim() || !phone.trim() || !transactionId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createBooking.mutateAsync({
        slot_id: selectedSlotId,
        client_name: name.trim(),
        client_email: email.trim(),
        client_phone: phone.trim(),
        payment_method: paymentMethod,
        transaction_id: transactionId.trim(),
        amount: sessionFee,
      });
      setSubmitted(true);
      toast.success("Booking submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  if (submitted) {
    return (
      <section id="booking" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center bg-card border border-border rounded-2xl p-12">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Booking Submitted!</h2>
            <p className="font-body text-muted-foreground mb-2">
              Thank you, <strong>{name}</strong>. Your booking has been received.
            </p>
            <p className="font-body text-sm text-muted-foreground">
              We'll verify your payment and send a confirmation email to <strong>{email}</strong> shortly.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Book Your Session</h2>
          <p className="font-body text-muted-foreground">
            Session Fee: <strong className="text-foreground">৳{sessionFee.toLocaleString()}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* Step 1: Select Date & Slot */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">1. Select Date & Time</h3>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 border border-border rounded-xl font-body text-sm text-left",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlotId("");
                  }}
                  disabled={(date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    return !availableDates.has(dateStr);
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {slotsForDate.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slotsForDate.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl border font-body text-sm transition-all",
                      selectedSlotId === slot.id
                        ? "bg-primary text-primary-foreground border-primary shadow-crystal"
                        : "border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Your Info */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">2. Your Information</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Full Name *"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Email Address *"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Phone Number *"
              required
            />
          </div>

          {/* Step 3: Payment */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">3. Payment</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("bkash")}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl border font-body text-sm font-medium transition-all",
                  paymentMethod === "bkash"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary/50"
                )}
              >
                bKash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl border font-body text-sm font-medium transition-all",
                  paymentMethod === "bank_transfer"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary/50"
                )}
              >
                Bank Transfer
              </button>
            </div>

            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              {paymentMethod === "bkash" ? (
                <div className="font-body text-sm">
                  <p className="text-foreground font-medium mb-1">bKash Payment</p>
                  <p className="text-muted-foreground">Send <strong>৳{sessionFee.toLocaleString()}</strong> to:</p>
                  <p className="text-foreground font-mono mt-1">{bkashNumber}</p>
                </div>
              ) : (
                <div className="font-body text-sm">
                  <p className="text-foreground font-medium mb-1">Bank Transfer</p>
                  <p className="text-muted-foreground">Transfer <strong>৳{sessionFee.toLocaleString()}</strong> to:</p>
                  <pre className="text-foreground mt-1 whitespace-pre-wrap text-xs">{bankDetails}</pre>
                </div>
              )}
            </div>

            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="Transaction ID / Reference ID *"
              required
            />
          </div>

          <button
            type="submit"
            disabled={createBooking.isPending || !selectedSlotId}
            className="w-full py-4 bg-gradient-crystal text-primary-foreground font-body font-medium rounded-xl shadow-crystal hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createBooking.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Submit Booking"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
