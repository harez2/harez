import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking, type } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const slot = booking.consultation_slots || {};
    const slotDate = slot.date || "TBD";
    const slotTime = slot.start_time ? `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}` : "TBD";

    let subject = "";
    let html = "";
    let to = "";

    if (type === "new_booking") {
      // Email to admin
      subject = `New Booking: ${booking.client_name}`;
      to = ADMIN_EMAIL;
      html = `
        <h2>New Consultation Booking</h2>
        <p><strong>Client:</strong> ${booking.client_name}</p>
        <p><strong>Email:</strong> ${booking.client_email}</p>
        <p><strong>Phone:</strong> ${booking.client_phone}</p>
        <p><strong>Date:</strong> ${slotDate}</p>
        <p><strong>Time:</strong> ${slotTime}</p>
        <p><strong>Payment:</strong> ${booking.payment_method}</p>
        <p><strong>Transaction ID:</strong> ${booking.transaction_id}</p>
        <p><strong>Amount:</strong> ৳${booking.amount}</p>
        <p>Please verify the payment and confirm the booking.</p>
      `;

      // Send admin email
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: "Bookings <onboarding@resend.dev>", to: [to], subject, html }),
      });

      // Also send confirmation to client
      const clientHtml = `
        <h2>Booking Received!</h2>
        <p>Hi ${booking.client_name},</p>
        <p>Your booking has been received and is pending payment verification.</p>
        <p><strong>Date:</strong> ${slotDate}</p>
        <p><strong>Time:</strong> ${slotTime}</p>
        <p><strong>Amount:</strong> ৳${booking.amount}</p>
        <p><strong>Transaction ID:</strong> ${booking.transaction_id}</p>
        <p>We'll confirm your booking shortly after verifying the payment.</p>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: "Bookings <onboarding@resend.dev>", to: [booking.client_email], subject: "Booking Received - Pending Confirmation", html: clientHtml }),
      });

    } else if (type === "status_update") {
      // Status update email to client
      to = booking.client_email;
      subject = `Booking ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`;
      html = `
        <h2>Booking Update</h2>
        <p>Hi ${booking.client_name},</p>
        <p>Your booking status has been updated to: <strong>${booking.status}</strong></p>
        <p><strong>Date:</strong> ${slotDate}</p>
        <p><strong>Time:</strong> ${slotTime}</p>
        ${booking.status === "confirmed" ? "<p>Your session is confirmed! We look forward to meeting you.</p>" : ""}
        ${booking.status === "cancelled" ? "<p>If you believe this is an error, please contact us.</p>" : ""}
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: "Bookings <onboarding@resend.dev>", to: [to], subject, html }),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
