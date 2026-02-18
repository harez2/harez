

# Business Growth 1:1 Session Landing Page

## Overview
A dedicated landing page at `/business-growth` for booking one-on-one business growth consultation sessions. Fully editable from the admin panel with appointment booking, manual payment verification (bKash/Bank Transfer), and email notifications.

## Landing Page Sections

### 1. Hero / Bio Section
- Editable headline, subtitle, and bio text
- Profile image (reuses existing upload system)
- CTA button linking to booking section

### 2. Previous Projects Glimpse
- Grid of project cards with image, title, and short description
- Manageable from admin panel (add/edit/delete)

### 3. Video Section
- Embeddable video (YouTube/Vimeo URL)
- Editable title and description text around the video

### 4. Benefits Section
- List of benefit items with icons and descriptions
- Editable from admin panel

### 5. Client Reviews
- Testimonial cards with client name, photo, company, and review text
- Manageable from admin panel

### 6. Appointment Booking + Payment
- Calendar-style date picker showing available time slots
- Client fills in: name, email, phone, preferred date/time
- Payment method selection: bKash or Bank Transfer
- Displays payment instructions (account number, etc.)
- Client submits transaction/reference ID after payment
- Confirmation screen with booking summary

---

## Database Schema

### New Tables

**`consultation_content`** - Stores editable page content (bio, video URL, benefits)
- `id` (uuid, PK)
- `section` (text) -- e.g., 'hero', 'video', 'benefits'
- `content` (jsonb)
- `created_at`, `updated_at` (timestamptz)

**`consultation_projects`** - Previous project showcase
- `id` (uuid, PK)
- `title` (text)
- `description` (text)
- `image_url` (text, nullable)
- `link` (text, nullable)
- `display_order` (integer, default 0)
- `created_at`, `updated_at` (timestamptz)

**`consultation_reviews`** - Client testimonials
- `id` (uuid, PK)
- `client_name` (text)
- `client_company` (text, nullable)
- `client_photo` (text, nullable)
- `review_text` (text)
- `rating` (integer, default 5)
- `display_order` (integer, default 0)
- `created_at`, `updated_at` (timestamptz)

**`consultation_slots`** - Available booking time slots (admin-managed)
- `id` (uuid, PK)
- `date` (date)
- `start_time` (time)
- `end_time` (time)
- `is_available` (boolean, default true)
- `created_at` (timestamptz)

**`consultation_bookings`** - All bookings
- `id` (uuid, PK)
- `slot_id` (uuid, FK to consultation_slots)
- `client_name` (text)
- `client_email` (text)
- `client_phone` (text)
- `payment_method` (text) -- 'bkash' or 'bank_transfer'
- `transaction_id` (text)
- `amount` (numeric, default 0)
- `status` (text, default 'pending') -- pending, confirmed, cancelled, completed
- `admin_notes` (text, nullable)
- `created_at`, `updated_at` (timestamptz)

### RLS Policies
- `consultation_content`, `consultation_projects`, `consultation_reviews`: Public SELECT, authenticated INSERT/UPDATE/DELETE
- `consultation_slots`: Public SELECT (where is_available = true), authenticated full access
- `consultation_bookings`: Public INSERT (for clients booking), authenticated full access for admin management

---

## New Files

### Pages
- **`src/pages/BusinessGrowth.tsx`** -- The landing page composing all sections
- **`src/pages/BookingConfirmation.tsx`** -- Post-booking confirmation page

### Landing Page Components
- **`src/components/consultation/ConsultationHero.tsx`** -- Bio/hero section
- **`src/components/consultation/ConsultationProjects.tsx`** -- Previous projects grid
- **`src/components/consultation/ConsultationVideo.tsx`** -- Video embed section
- **`src/components/consultation/ConsultationBenefits.tsx`** -- Benefits list
- **`src/components/consultation/ConsultationReviews.tsx`** -- Client reviews carousel/grid
- **`src/components/consultation/BookingForm.tsx`** -- Appointment booking with payment

### Admin Components
- **`src/components/admin/ConsultationContentEditor.tsx`** -- Edit hero/bio, video URL, benefits
- **`src/components/admin/ConsultationProjectsEditor.tsx`** -- Manage project showcase entries
- **`src/components/admin/ConsultationReviewsEditor.tsx`** -- Manage client reviews
- **`src/components/admin/ConsultationSlotsEditor.tsx`** -- Manage available time slots
- **`src/components/admin/ConsultationBookingsManager.tsx`** -- View/manage all bookings, update status

### Hooks
- **`src/hooks/useConsultation.ts`** -- All CRUD hooks for consultation tables

### Backend Function
- **`supabase/functions/send-booking-email/index.ts`** -- Sends email notifications using Resend API:
  - To admin: New booking received with client details and transaction ID
  - To client: Booking confirmation with session details and status updates

---

## Modified Files

- **`src/App.tsx`** -- Add routes: `/business-growth`, `/booking-confirmation`
- **`src/pages/Admin.tsx`** -- Add new admin tabs: "Consultation", "Bookings", "Slots"
- **`src/components/Navigation.tsx`** -- Add "1:1 Session" link to navigation

---

## Booking Flow (Client Perspective)

```text
1. Client visits /business-growth
2. Scrolls through bio, projects, video, benefits, reviews
3. Reaches booking section
4. Selects an available date and time slot
5. Fills in name, email, phone
6. Chooses payment method (bKash or Bank Transfer)
7. Sees payment instructions (account number, amount)
8. Makes payment externally
9. Returns and enters transaction/reference ID
10. Submits booking
11. Receives confirmation email
12. Admin receives notification email with booking details
```

## Admin Management Flow

```text
1. Admin goes to Admin Panel > Consultation tab
   - Edits hero/bio text, video URL, benefits list
   - Manages project showcase entries
   - Manages client reviews
2. Admin goes to Admin Panel > Slots tab
   - Adds available dates and time slots
   - Toggles slot availability
3. Admin goes to Admin Panel > Bookings tab
   - Views all bookings with status filters
   - Verifies transaction IDs manually
   - Updates booking status (pending -> confirmed -> completed)
   - Adds admin notes
   - Status changes trigger email notifications to the client
```

## Email Notifications

Using the existing Resend API integration (RESEND_API_KEY already configured):

1. **New Booking (to admin)**: Client name, email, phone, selected slot, payment method, transaction ID
2. **Booking Confirmation (to client)**: Session date/time, payment status, what to expect
3. **Status Update (to client)**: When admin confirms/cancels the booking

---

## Technical Notes

- Reuses existing patterns: `useSiteContent`-style hooks, admin editor patterns from `ExperienceEditor`, `uploadImage` for file uploads
- Payment is manual -- no payment gateway integration needed. The page simply displays bKash number / bank details and collects the transaction ID
- The `consultation_content` table follows the same `section + jsonb` pattern as `site_content` for flexible content storage
- Available slots are date+time based, managed by admin, and automatically hidden once booked

