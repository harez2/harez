import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escHtml = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, type } = await req.json();

    if (!bookingId || typeof bookingId !== "string" || !/^[0-9a-f-]{36}$/i.test(bookingId)) {
      return new Response(JSON.stringify({ error: "Invalid bookingId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (type !== "new_booking" && type !== "status_update") {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // status_update requires an authenticated admin caller
    if (type === "status_update") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const token = authHeader.replace("Bearer ", "");
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );
      const { data: userData, error: userErr } = await userClient.auth.getUser(token);
      if (userErr || !userData?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roleRow } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch booking from DB (never trust client-supplied booking payload)
    const { data: booking, error: bookingErr } = await admin
      .from("consultation_bookings")
      .select("*, consultation_slots(*)")
      .eq("id", bookingId)
      .maybeSingle();
    if (bookingErr || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prevent notification spam: new_booking may fire only once, within 10 min
    // of the booking being created, and only if not already notified.
    if (type === "new_booking") {
      const createdMs = booking.created_at ? Date.parse(booking.created_at) : 0;
      const ageMs = Date.now() - createdMs;
      if (booking.notified_at || ageMs > 10 * 60 * 1000 || ageMs < 0) {
        return new Response(
          JSON.stringify({ error: "Notification not allowed for this booking" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      // Atomically claim the notification slot.
      const { data: claimed, error: claimErr } = await admin
        .from("consultation_bookings")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", bookingId)
        .is("notified_at", null)
        .select("id")
        .maybeSingle();
      if (claimErr || !claimed) {
        return new Response(
          JSON.stringify({ error: "Notification already sent" }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const slot = booking.consultation_slots || {};
    const slotDate = slot.date || "TBD";
    const slotTime = slot.start_time ? `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}` : "TBD";

    let subject = "";
    let html = "";
    let to = "";

    if (type === "new_booking") {
      // Email to admin
      subject = `New Booking: ${booking.client_name}`.slice(0, 200);
      to = ADMIN_EMAIL;
      html = `
        <h2>New Consultation Booking</h2>
        <p><strong>Client:</strong> ${escHtml(booking.client_name)}</p>
        <p><strong>Email:</strong> ${escHtml(booking.client_email)}</p>
        <p><strong>Phone:</strong> ${escHtml(booking.client_phone)}</p>
        <p><strong>Date:</strong> ${escHtml(slotDate)}</p>
        <p><strong>Time:</strong> ${escHtml(slotTime)}</p>
        <p><strong>Payment:</strong> ${escHtml(booking.payment_method)}</p>
        <p><strong>Transaction ID:</strong> ${escHtml(booking.transaction_id)}</p>
        <p><strong>Amount:</strong> ৳${escHtml(booking.amount)}</p>
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
        <p>Hi ${escHtml(booking.client_name)},</p>
        <p>Your booking has been received and is pending payment verification.</p>
        <p><strong>Date:</strong> ${escHtml(slotDate)}</p>
        <p><strong>Time:</strong> ${escHtml(slotTime)}</p>
        <p><strong>Amount:</strong> ৳${escHtml(booking.amount)}</p>
        <p><strong>Transaction ID:</strong> ${escHtml(booking.transaction_id)}</p>
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
        <p>Hi ${escHtml(booking.client_name)},</p>
        <p>Your booking status has been updated to: <strong>${escHtml(booking.status)}</strong></p>
        <p><strong>Date:</strong> ${escHtml(slotDate)}</p>
        <p><strong>Time:</strong> ${escHtml(slotTime)}</p>
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
