
# Brands I Worked With Section

A futuristic, animated brands showcase section that displays partner/client logos with admin panel management.

## Overview

This feature adds a new "Brands I Worked With" section between Skills and Experience sections, featuring:
- Animated logo carousel with infinite scroll effect
- Futuristic glassmorphism design with glow effects
- Hover animations and holographic styling
- Full admin panel integration for logo uploads and management

## Frontend Design

### Visual Style
- **Infinite scrolling marquee** - Logos scroll continuously for a dynamic feel
- **Glassmorphism cards** - Each logo sits on a frosted glass card
- **Neon glow effects** - Subtle blue/violet glow on hover
- **Holographic shimmer** - Crystal shine animation on logo cards
- **Dark gradient background** - Creates depth and futuristic atmosphere

### Layout
- Section header with gradient text styling (matching existing sections)
- Two-row infinite scroll marquee (second row moves in opposite direction)
- Responsive grid fallback for reduced motion preferences

## Implementation Steps

### 1. Database Migration
Create a new `brands` table to store brand information:
- `id` (UUID, primary key)
- `name` (text, brand name for alt text)
- `logo_url` (text, URL to logo image)
- `website_url` (text, optional link to brand website)
- `display_order` (integer, for ordering)
- `created_at`, `updated_at` (timestamps)

RLS policies will allow public read access and authenticated user write access.

### 2. Hook Updates
Add to `useSiteContent.ts`:
- `Brand` interface
- `useBrands()` hook for fetching brands
- `useCreateBrand()` mutation
- `useUpdateBrand()` mutation
- `useDeleteBrand()` mutation

### 3. Brands Component
Create `src/components/Brands.tsx`:
- Fetches brand data using the new hook
- Implements CSS-based infinite marquee animation
- Glassmorphism logo cards with hover effects
- Responsive design with scroll reveal animation
- Accessibility: respects `prefers-reduced-motion`

### 4. Admin Editor
Create `src/components/admin/BrandsEditor.tsx`:
- Logo upload with preview
- Brand name and optional website URL fields
- Drag-to-reorder functionality (or display_order input)
- Delete confirmation
- Grid display of all brand logos

### 5. Integration
- Add Brands tab to Admin.tsx
- Insert Brands component between Skills and Experience in Index.tsx
- Add CSS animations for marquee effect in index.css

---

## Technical Details

### New Database Table Schema

```sql
CREATE TABLE public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### CSS Animations

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
```

### Component Hierarchy

```text
Index.tsx
  |-- Navigation
  |-- Hero
  |-- About
  |-- Skills
  |-- Brands (NEW)
  |-- Experience
  |-- Contact
  |-- Footer

Admin.tsx
  |-- Tabs: Hero | About | Skills | Brands (NEW) | Experience | Contact
```

### Files to Create
1. `src/components/Brands.tsx` - Frontend display component
2. `src/components/admin/BrandsEditor.tsx` - Admin management interface

### Files to Modify
1. `src/hooks/useSiteContent.ts` - Add brand hooks
2. `src/pages/Admin.tsx` - Add Brands tab
3. `src/pages/Index.tsx` - Add Brands component
4. `src/index.css` - Add marquee animations

### Database Migration
- Create `brands` table with RLS policies
- Add trigger for `updated_at` column
